import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('SMTP_PORT', 587),
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
    }
  }

  private get fromAddress(): string {
    return this.configService.get<string>('SMTP_FROM', 'noreply@ashabamusic.com');
  }

  async sendDownloadLink(email: string, downloadUrl: string, songTitles: string[]) {
    if (!this.transporter) {
      this.logger.warn('SMTP not configured — skipping download email');
      return;
    }

    const trackList = songTitles.map((t) => `  - ${t}`).join('\n');

    await this.transporter.sendMail({
      from: this.fromAddress,
      to: email,
      subject: 'Your Ashaba Music Download',
      text: `Thank you for your purchase!\n\nTracks:\n${trackList}\n\nDownload your music here:\n${downloadUrl}\n\nThis link expires in 48 hours.\n\n- Ashaba Music`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p><strong>Tracks:</strong></p>
        <ul>${songTitles.map((t) => `<li>${t}</li>`).join('')}</ul>
        <p><a href="${downloadUrl}" style="background:#e11d48;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Download Your Music</a></p>
        <p><small>This link expires in 48 hours.</small></p>
        <p>- Ashaba Music</p>
      `,
    });

    this.logger.log(`Download email sent to ${email}`);
  }

  async sendTicket(email: string, ticketPdf: Buffer, concertTitle: string) {
    if (!this.transporter) {
      this.logger.warn('SMTP not configured — skipping ticket email');
      return;
    }

    await this.transporter.sendMail({
      from: this.fromAddress,
      to: email,
      subject: `Your Ticket: ${concertTitle}`,
      text: `Your ticket for ${concertTitle} is attached. Present the QR code at the entrance.\n\n- Ashaba Music`,
      html: `
        <h2>Your Ticket for ${concertTitle}</h2>
        <p>Your ticket is attached as a PDF. Present the QR code at the entrance.</p>
        <p>- Ashaba Music</p>
      `,
      attachments: [
        {
          filename: 'ticket.pdf',
          content: ticketPdf,
          contentType: 'application/pdf',
        },
      ],
    });

    this.logger.log(`Ticket email sent to ${email}`);
  }
}
