import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/orm.config';
import { BookingsModule } from './bookings/bookings.module';
import { MusicModule } from './music/music.module';
import { ImagesModule } from './images/images.module';
import { MerchandiseModule } from './merchandise/merchandise.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';
import { ConcertsModule } from './concerts/concerts.module';
import { PurchasesModule } from './purchases/purchases.module';
import { EmailModule } from './email/email.module';
import { PaymentsService } from './payments/payments.service';
import { PurchasesService } from './purchases/purchases.service';
import { TicketsService } from './tickets/tickets.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    PaymentsModule,
    TicketsModule,
    BookingsModule,
    MusicModule,
    ImagesModule,
    MerchandiseModule,
    MediaModule,
    AuthModule,
    ConcertsModule,
    PurchasesModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly purchasesService: PurchasesService,
    private readonly ticketsService: TicketsService,
  ) {}

  onModuleInit() {
    // Wire up circular dependencies for IPN post-payment routing
    this.paymentsService.setPurchasesService(this.purchasesService);
    this.paymentsService.setTicketsService(this.ticketsService);
  }
}
