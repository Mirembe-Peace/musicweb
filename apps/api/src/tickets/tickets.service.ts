import { Injectable, Logger, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { Ticket } from './entities/ticket.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { PaymentsService } from '../payments/payments.service';
import { EmailService } from '../email/email.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Concert)
    private readonly concertRepo: Repository<Concert>,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async purchaseTicket(dto: CreateTicketDto) {
    const concert = await this.concertRepo.findOne({ where: { id: dto.concertId } });
    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    const ticketCode = `TKT-${randomUUID().split('-')[0].toUpperCase()}`;

    // Initiate payment
    const paymentResult = await this.paymentsService.initiatePayment({
      amount: Number(concert.price),
      description: `Ticket: ${concert.title}`,
      email: dto.buyerEmail,
      phoneNumber: dto.buyerPhone,
      callbackUrl: dto.callbackUrl,
      currency: 'UGX',
    }, 'TICKET');

    // Create ticket
    const ticket = this.ticketRepo.create({
      concertId: dto.concertId,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      buyerPhone: dto.buyerPhone,
      ticketCode,
      paymentId: paymentResult.paymentId,
      status: 'PENDING',
    });

    await this.ticketRepo.save(ticket);

    return {
      redirect_url: paymentResult.redirect_url,
      ticketId: ticket.id,
    };
  }

  async verifyTicket(ticketCode: string) {
    const ticket = await this.ticketRepo.findOne({ where: { ticketCode } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const concert = await this.concertRepo.findOne({ where: { id: ticket.concertId } });

    return {
      valid: ticket.status === 'PAID',
      status: ticket.status,
      buyerName: ticket.buyerName,
      concert: concert ? {
        title: concert.title,
        dateTime: concert.dateTime,
        location: concert.location,
      } : null,
    };
  }

  async markUsed(ticketCode: string) {
    const ticket = await this.ticketRepo.findOne({ where: { ticketCode } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.status !== 'PAID') {
      throw new BadRequestException(`Ticket cannot be used — status is ${ticket.status}`);
    }

    ticket.status = 'USED';
    await this.ticketRepo.save(ticket);
    return { message: 'Ticket marked as used' };
  }

  async findByEmail(email: string) {
    const tickets = await this.ticketRepo.find({
      where: { buyerEmail: email },
      order: { createdAt: 'DESC' },
    });

    const concertIds = [...new Set(tickets.map((t) => t.concertId))];
    const concerts = concertIds.length > 0
      ? await this.concertRepo.find({ where: { id: In(concertIds) } })
      : [];
    const concertMap = new Map(concerts.map((c) => [c.id, c]));

    return tickets.map((t) => ({
      ...t,
      concert: concertMap.get(t.concertId) || null,
    }));
  }

  async findByConcert(concertId: string) {
    return this.ticketRepo.find({
      where: { concertId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.ticketRepo.find({ order: { createdAt: 'DESC' } });
  }

  async completeTicket(paymentId: string) {
    const ticket = await this.ticketRepo.findOne({ where: { paymentId } });
    if (!ticket) {
      this.logger.warn(`No ticket found for paymentId: ${paymentId}`);
      return;
    }

    ticket.status = 'PAID';
    ticket.purchasedAt = new Date();
    await this.ticketRepo.save(ticket);

    // Get concert details
    const concert = await this.concertRepo.findOne({ where: { id: ticket.concertId } });
    const concertTitle = concert?.title || 'Ashaba Music Concert';

    // Generate QR + PDF
    try {
      const pdfBuffer = await this.generateTicketPdf(ticket, concert);
      await this.emailService.sendTicket(ticket.buyerEmail, pdfBuffer, concertTitle);
    } catch (err) {
      this.logger.error('Failed to generate/send ticket PDF', err);
    }

    this.logger.log(`Ticket ${ticket.id} completed for ${concertTitle}`);
  }

  private async generateTicketPdf(ticket: Ticket, concert: Concert | null): Promise<Buffer> {
    const verifyUrl = `${this.configService.get<string>('CLIENT_URL', 'http://localhost:5173')}/tickets/verify/${ticket.ticketCode}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200 });
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A5', margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('ASHABA MUSIC', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(16).text('CONCERT TICKET', { align: 'center' });
      doc.moveDown(1);

      // Concert details
      doc.fontSize(12).font('Helvetica');
      if (concert) {
        doc.text(`Event: ${concert.title}`);
        doc.text(`Date: ${concert.dateTime}`);
        doc.text(`Venue: ${concert.location}`);
      }
      doc.moveDown(0.5);
      doc.text(`Attendee: ${ticket.buyerName}`);
      doc.text(`Ticket Code: ${ticket.ticketCode}`);
      doc.moveDown(1);

      // QR Code
      doc.image(qrBuffer, { fit: [160, 160], align: 'center' });
      doc.moveDown(1);

      // Footer
      doc.fontSize(9).text('Present this QR code at the entrance.', { align: 'center' });

      doc.end();
    });
  }

  async getQrDataUrl(ticketCode: string): Promise<string> {
    const verifyUrl = `${this.configService.get<string>('CLIENT_URL', 'http://localhost:5173')}/tickets/verify/${ticketCode}`;
    return QRCode.toDataURL(verifyUrl, { width: 300 });
  }
}
