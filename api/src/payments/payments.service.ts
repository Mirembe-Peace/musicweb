import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { randomUUID } from 'crypto';

const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async initiatePayment(createPaymentDto: CreatePaymentDto) {
    try {
      // 1️⃣ Get OAuth token
      const tokenRes = await fetch(
        `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            consumer_key: process.env.PESAPAL_CONSUMER_KEY,
            consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
          }),
        },
      );

      if (!tokenRes.ok) {
        throw new Error('Failed to get Pesapal token');
      }

      const tokenData = await tokenRes.json();
      const token = tokenData.token;

      if (!token) {
        throw new Error('Pesapal token missing');
      }

      // 2️⃣ Create merchant reference
      const merchantReference = randomUUID();

      // 3️⃣ Submit order
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
            notification_id: createPaymentDto.notification_id,
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

      if (!orderData.redirect_url) {
        throw new Error('Redirect URL missing from Pesapal response');
      }

      // 4️⃣ Save payment to database
      const payment = this.paymentsRepository.create({
        id: merchantReference, // This will be saved as the primary key if it matches the entity definition, or we might want to use merchantReference column
        orderTrackingId: orderData.order_tracking_id,
        merchantReference: merchantReference,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency || 'UGX',
        description: createPaymentDto.description,
        email: createPaymentDto.email,
        phoneNumber: createPaymentDto.phoneNumber,
        status: 'PENDING',
      });

      await this.paymentsRepository.save(payment);

      return {
        redirect_url: orderData.redirect_url,
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

    if (payment) {
      payment.status = 'COMPLETED';
      await this.paymentsRepository.save(payment);
    }

    return {
      message: 'IPN handled',
      orderTrackingId,
      orderMerchantReference,
    };
  }

  findAll() {
    return this.paymentsRepository.find();
  }

  findOne(id: string) {
    return this.paymentsRepository.findOne({ where: { id } });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
