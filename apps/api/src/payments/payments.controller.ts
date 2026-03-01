import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      return await this.paymentsService.initiatePayment(createPaymentDto);
    } catch (error) {
      this.logger.error(
        'Payment initiation failed',
        error instanceof Error ? error.message : String(error),
      );
      throw new HttpException(
        'Payment initiation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tip')
  async tip(
    @Body() body: { amount: number; email: string; phoneNumber?: string; callbackUrl: string },
  ) {
    try {
      return await this.paymentsService.initiatePayment(
        {
          amount: body.amount,
          description: 'Tip for Ashaba Music',
          email: body.email,
          phoneNumber: body.phoneNumber,
          callbackUrl: body.callbackUrl,
          currency: 'UGX',
        },
        'TIP',
      );
    } catch (error) {
      this.logger.error('Tip initiation failed', error);
      throw new HttpException(
        'Tip initiation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('ipn')
  async ipn(
    @Query('OrderTrackingId') orderTrackingId: string,
    @Query('OrderMerchantReference') orderMerchantReference: string,
  ) {
    this.logger.log(`Received IPN for Order: ${orderTrackingId}`);
    try {
      return await this.paymentsService.handleIpn(
        orderTrackingId,
        orderMerchantReference,
      );
    } catch (error) {
      this.logger.error(
        `IPN handling failed for Order: ${orderTrackingId}`,
        error,
      );
      throw new HttpException(
        'IPN handling failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
