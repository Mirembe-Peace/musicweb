import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post('initiate')
  initiate(@Body() dto: CreatePurchaseDto) {
    return this.purchasesService.initiatePurchase(dto);
  }

  @Get('download/:token')
  download(@Param('token') token: string) {
    return this.purchasesService.getDownload(token);
  }

  @Get('status/:paymentId')
  status(@Param('paymentId') paymentId: string) {
    return this.purchasesService.getStatus(paymentId);
  }
}
