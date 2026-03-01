import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MusicService } from './music/music.service';
import { PaymentsService } from './payments/payments.service';
import { BookingsService } from './bookings/bookings.service';
import { ConcertsService } from './concerts/concerts.service';
import { TicketsService } from './tickets/tickets.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly musicService: MusicService,
    private readonly paymentsService: PaymentsService,
    private readonly bookingsService: BookingsService,
    private readonly concertsService: ConcertsService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    const [
      totalSongs,
      paymentStats,
      bookings,
      concerts,
      tickets,
    ] = await Promise.all([
      this.musicService.getCount(),
      this.paymentsService.getStats(),
      this.bookingsService.findAll(),
      this.concertsService.findAll(),
      this.ticketsService.findAll(),
    ]);

    const upcomingConcerts = concerts.filter(
      (c) => new Date(c.dateTime) > new Date(),
    );

    return {
      totalSongs,
      totalPayments: paymentStats.totalPayments,
      totalRevenue: paymentStats.totalRevenue,
      recentBookings: bookings.slice(0, 5),
      upcomingConcerts: upcomingConcerts.length,
      ticketsSold: tickets.filter((t) => t.status === 'PAID' || t.status === 'USED').length,
      totalBookings: bookings.length,
    };
  }
}
