import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    HttpModule,
    ConfigModule,
    TicketsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

/* encapsulates all payment related functionality
//registers the payment entity with type
//provides the payment and pesapal service for dependency injection
//imports httpmodule for making http requests to pesapal api
//exports paymentsservice so that other modules can use it
//imports ticketmodule to access ticket-related operations */