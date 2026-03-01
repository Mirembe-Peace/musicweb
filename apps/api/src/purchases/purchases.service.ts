import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { Song } from '../music/entities/song.entity';
import { PaymentsService } from '../payments/payments.service';
import { EmailService } from '../email/email.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name);

  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepo: Repository<PurchaseItem>,
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,
    private readonly paymentsService: PaymentsService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async initiatePurchase(dto: CreatePurchaseDto) {
    const songs = await this.songRepo.find({
      where: { id: In(dto.songIds) },
    });

    if (songs.length === 0) {
      throw new BadRequestException('No valid songs found');
    }

    const total = songs.reduce((sum, s) => sum + Number(s.price), 0);
    const songTitles = songs.map((s) => s.title).join(', ');

    // Initiate Pesapal payment
    const paymentResult = await this.paymentsService.initiatePayment({
      amount: total,
      description: `Music purchase: ${songTitles}`,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      callbackUrl: dto.callbackUrl,
      currency: 'UGX',
    }, 'MUSIC_PURCHASE');

    // Create purchase record
    const downloadToken = randomUUID();
    const purchase = this.purchaseRepo.create({
      buyerEmail: dto.email,
      buyerPhone: dto.phoneNumber,
      paymentId: paymentResult.paymentId,
      downloadToken,
      status: 'PENDING',
    });

    const saved = await this.purchaseRepo.save(purchase);

    // Create purchase items
    const items = songs.map((song) =>
      this.purchaseItemRepo.create({
        purchaseId: saved.id,
        songId: song.id,
      }),
    );
    await this.purchaseItemRepo.save(items);

    return {
      redirect_url: paymentResult.redirect_url,
      purchaseId: saved.id,
    };
  }

  async getDownload(token: string) {
    const purchase = await this.purchaseRepo.findOne({
      where: { downloadToken: token },
      relations: ['items'],
    });

    if (!purchase) {
      throw new NotFoundException('Download not found');
    }

    if (purchase.status !== 'COMPLETED') {
      throw new BadRequestException('Payment not yet completed');
    }

    if (purchase.downloadExpiresAt && new Date() > purchase.downloadExpiresAt) {
      throw new BadRequestException('Download link has expired');
    }

    // Get song details
    const songIds = purchase.items.map((i) => i.songId);
    const songs = await this.songRepo.find({
      where: { id: In(songIds) },
    });

    return {
      songs: songs.map((s) => ({
        id: s.id,
        title: s.title,
        audioUrl: s.audioUrl,
        coverImageUrl: s.coverImageUrl,
      })),
      expiresAt: purchase.downloadExpiresAt,
    };
  }

  async getStatus(paymentId: string) {
    const purchase = await this.purchaseRepo.findOne({
      where: { paymentId },
      relations: ['items'],
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    const songIds = purchase.items.map((i) => i.songId);
    const songs = await this.songRepo.find({
      where: { id: In(songIds) },
    });

    return {
      id: purchase.id,
      status: purchase.status,
      downloadToken: purchase.status === 'COMPLETED' ? purchase.downloadToken : null,
      songs: songs.map((s) => ({
        id: s.id,
        title: s.title,
        coverImageUrl: s.coverImageUrl,
      })),
    };
  }

  async completePurchase(paymentId: string) {
    const purchase = await this.purchaseRepo.findOne({
      where: { paymentId },
      relations: ['items'],
    });

    if (!purchase) {
      this.logger.warn(`No purchase found for paymentId: ${paymentId}`);
      return;
    }

    purchase.status = 'COMPLETED';
    purchase.downloadExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    await this.purchaseRepo.save(purchase);

    // Send email
    const songIds = purchase.items.map((i) => i.songId);
    const songs = await this.songRepo.find({ where: { id: In(songIds) } });
    const songTitles = songs.map((s) => s.title);

    const clientUrl = this.configService.get<string>('CLIENT_URL', 'http://localhost:5173');
    const downloadUrl = `${clientUrl}/download/${purchase.downloadToken}`;
    await this.emailService.sendDownloadLink(purchase.buyerEmail, downloadUrl, songTitles);

    this.logger.log(`Purchase ${purchase.id} completed, download email sent`);
  }
}
