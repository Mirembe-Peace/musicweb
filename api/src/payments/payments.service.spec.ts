import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  async initiatePayment(createPaymentDto: CreatePaymentDto) {
    // 🔵 Call Pesapal here
    // 1. Get token
    // 2. Submit order
    // 3. Return redirect URL

    return {
      message: 'Payment initiated',
      data: createPaymentDto,
    };
  }

  async handleIpn(orderTrackingId: string, orderMerchantReference: string) {
    // 🔵 Verify payment with Pesapal
    // 1. Query payment status
    // 2. Update DB

    return {
      message: 'IPN handled',
      orderTrackingId,
      orderMerchantReference,
    };
  }

  findAll() {
    return [];
  }

  findOne(id: string) {
    return { id };
  }

  update(id: number, dto: any) {
    return { id, updated: true };
  }

  remove(id: number) {
    return { id, deleted: true };
  }
}
