import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('purchase')
  purchase(@Body() dto: CreateTicketDto) {
    return this.ticketsService.purchaseTicket(dto);
  }

  @Get('verify/:ticketCode')
  verify(@Param('ticketCode') ticketCode: string) {
    return this.ticketsService.verifyTicket(ticketCode);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mark-used/:ticketCode')
  markUsed(@Param('ticketCode') ticketCode: string) {
    return this.ticketsService.markUsed(ticketCode);
  }

  @Get('my/:email')
  findByEmail(@Param('email') email: string) {
    return this.ticketsService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('concert/:concertId')
  findByConcert(@Param('concertId') concertId: string) {
    return this.ticketsService.findByConcert(concertId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('qr/:ticketCode')
  async getQr(@Param('ticketCode') ticketCode: string) {
    const qrDataUrl = await this.ticketsService.getQrDataUrl(ticketCode);
    return { qrDataUrl };
  }
}
