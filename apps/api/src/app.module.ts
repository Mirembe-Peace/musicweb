import { Module } from '@nestjs/common';
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

@Module({
  imports: [ //other modules that this module depends on
    ConfigModule.forRoot({ isGlobal: true }),// makes the env vars accessible in the whole app
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }), //establishes database connection
    PaymentsModule,
    TicketsModule,
    BookingsModule,
    MusicModule,
    ImagesModule,
    MerchandiseModule,
    MediaModule,
    AuthModule,
    ConcertsModule,
  ],
  controllers: [AppController], //endpoints exposed by this module where the frontend accesses the backend
  providers: [AppService], //services that can be injected anywhere in this module
})
export class AppModule {}


//the root module (dependency container)
//acts like the app.tsx root module that starts the whole application
//imports the global modules that are used throughout the app
//setsup the database connection asynchronously using env vars
//declares controllers and services available at the root level
//imports the feature modules (paymentsmodule, ticketsmodule)

