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

  @Post('initiate') // POST   /payments/initiate → Create new payment
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

  @Get('ipn') // GET    /payments/ipn?OrderTrackingId=xxx → Handle payment callback
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

  @Get() // GET    /payments → List all payments
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id') // GET    /payments/:id  → Get specific payment
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id') // PATCH  /payments/:id  → Update payment
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id') // DELETE /payments/:id → Delete payment
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}

// - Maps HTTP routes to service methods
// - Uses decorators:
//   - `@Controller('payments')`: Base route is `/payments`
//   - `@Post(), @Get(), @Patch(), @Delete()`: HTTP methods
//   - `@Body()`: Extract JSON body
//   - `@Query()`: Extract query parameters
//   - `@Param()`: Extract URL parameters
// - Delegates business logic to PaymentsService
