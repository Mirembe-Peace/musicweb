import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { randomUUID } from 'crypto';

const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private cachedIpnId: string | null = null;

  // Injected lazily to avoid circular deps
  private purchasesService: any;
  private ticketsService: any;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly configService: ConfigService,
  ) {}

  setPurchasesService(service: any) {
    this.purchasesService = service;
  }

  setTicketsService(service: any) {
    this.ticketsService = service;
  }

  private get consumerKey(): string {
    return this.configService.get<string>('PESAPAL_CONSUMER_KEY', '');
  }

  private get consumerSecret(): string {
    return this.configService.get<string>('PESAPAL_CONSUMER_SECRET', '');
  }

  private get ipnCallbackUrl(): string {
    const apiUrl = this.configService.get<string>('API_URL', 'http://localhost:3000');
    return `${apiUrl}/api/payments/ipn`;
  }

  private async getOAuthToken(): Promise<string> {
    const tokenRes = await fetch(
      `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consumer_key: this.consumerKey,
          consumer_secret: this.consumerSecret,
        }),
      },
    );

    if (!tokenRes.ok) {
      throw new Error('Failed to get Pesapal token');
    }

    const tokenData = await tokenRes.json();
    if (!tokenData.token) {
      throw new Error('Pesapal token missing');
    }

    return tokenData.token;
  }

  private async getOrRegisterIpnId(token: string): Promise<string> {
    if (this.cachedIpnId) return this.cachedIpnId;

    // If notification_id is configured in env, use it directly
    const envIpnId = this.configService.get<string>('PESAPAL_IPN_ID');
    if (envIpnId) {
      this.cachedIpnId = envIpnId;
      return envIpnId;
    }

    // Register IPN URL with Pesapal
    try {
      const res = await fetch(
        `${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: this.ipnCallbackUrl,
            ipn_notification_type: 'GET',
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.ipn_id) {
          this.cachedIpnId = data.ipn_id;
          this.logger.log(`Registered IPN URL, id: ${data.ipn_id}`);
          return data.ipn_id;
        }
      }
    } catch (err) {
      this.logger.warn('Failed to register IPN URL with Pesapal', err);
    }

    return '';
  }

  async initiatePayment(createPaymentDto: CreatePaymentDto, type: string = 'OTHER') {
    try {
      const token = await this.getOAuthToken();
      const notificationId = createPaymentDto.notification_id || await this.getOrRegisterIpnId(token);
      const merchantReference = randomUUID();

      const orderRes = await fetch(
        `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: merchantReference,
            currency: createPaymentDto.currency || 'UGX',
            amount: createPaymentDto.amount,
            description: createPaymentDto.description,
            callback_url: createPaymentDto.callbackUrl,
            notification_id: notificationId,
            billing_address: {
              email_address: createPaymentDto.email,
              phone_number: createPaymentDto.phoneNumber || '',
            },
          }),
        },
      );

      if (!orderRes.ok) {
        throw new Error('Failed to submit Pesapal order');
      }

      const orderData = await orderRes.json();
      this.logger.debug(`Pesapal order response: ${JSON.stringify(orderData)}`);

      if (!orderData.redirect_url) {
        this.logger.error(`Pesapal order submission failed. Response: ${JSON.stringify(orderData)}`);
        throw new Error(orderData.error?.message || orderData.message || 'Redirect URL missing from Pesapal response');
      }

      const payment = this.paymentsRepository.create({
        id: merchantReference,
        orderTrackingId: orderData.order_tracking_id,
        merchantReference: merchantReference,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency || 'UGX',
        description: createPaymentDto.description,
        email: createPaymentDto.email,
        phoneNumber: createPaymentDto.phoneNumber,
        type,
        status: 'PENDING',
      });

      await this.paymentsRepository.save(payment);

      return {
        redirect_url: orderData.redirect_url,
        paymentId: payment.id,
      };
    } catch (error) {
      this.logger.error('Payment initiation failed', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Payment initiation failed',
      );
    }
  }

  async handleIpn(orderTrackingId: string, orderMerchantReference: string) {
    this.logger.log(`IPN received for ${orderMerchantReference}`);

    const payment = await this.paymentsRepository.findOne({
      where: { id: orderMerchantReference },
    });

    if (!payment) {
      this.logger.warn(`Payment not found: ${orderMerchantReference}`);
      return { message: 'Payment not found' };
    }

    if (payment.status === 'COMPLETED') {
      return { message: 'Already processed' };
    }

    // Verify payment status with Pesapal before marking as completed
    try {
      const token = await this.getOAuthToken();
      const statusRes = await fetch(
        `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!statusRes.ok) {
        this.logger.warn(`Pesapal status check failed for ${orderTrackingId}`);
        return { message: 'Status verification failed' };
      }

      const statusData = await statusRes.json();
      const pesapalStatus = (statusData.payment_status_description || '').toUpperCase();

      if (pesapalStatus !== 'COMPLETED') {
        payment.status = pesapalStatus === 'FAILED' ? 'FAILED' : payment.status;
        await this.paymentsRepository.save(payment);
        this.logger.log(`Payment ${orderMerchantReference} status: ${pesapalStatus}`);
        return { message: `Payment status: ${pesapalStatus}` };
      }
    } catch (err) {
      this.logger.error('Pesapal verification failed, proceeding cautiously', err);
      // If Pesapal is unreachable, don't mark as completed
      return { message: 'Verification failed' };
    }

    // Pesapal confirmed — mark as completed
    payment.status = 'COMPLETED';
    await this.paymentsRepository.save(payment);

    // Route post-payment logic by type
    try {
      switch (payment.type) {
        case 'MUSIC_PURCHASE':
          if (this.purchasesService) {
            await this.purchasesService.completePurchase(payment.id);
          }
          break;
        case 'TICKET':
          if (this.ticketsService) {
            await this.ticketsService.completeTicket(payment.id);
          }
          break;
        case 'TIP':
          this.logger.log(`Tip payment completed: ${payment.amount} ${payment.currency}`);
          break;
        default:
          this.logger.log(`Payment completed (type: ${payment.type})`);
      }
    } catch (err) {
      this.logger.error(`Post-payment processing failed for ${payment.id}`, err);
    }

    return {
      message: 'IPN handled',
      orderTrackingId,
      orderMerchantReference,
    };
  }

  findAll() {
    return this.paymentsRepository.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: string) {
    return this.paymentsRepository.findOne({ where: { id } });
  }

  async getStats() {
    const totalPayments = await this.paymentsRepository.count();
    const result = await this.paymentsRepository
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('p.status = :status', { status: 'COMPLETED' })
      .getRawOne();
    const totalRevenue = Number(result?.total) || 0;
    return { totalPayments, totalRevenue };
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentsRepository.update(id, updatePaymentDto as any);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.paymentsRepository.delete(id);
  }
}
