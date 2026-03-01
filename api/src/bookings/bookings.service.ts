import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const booking = this.bookingsRepository.create(createBookingDto);
      return await this.bookingsRepository.save(booking);
    } catch (error) {
      this.logger.error('Failed to create booking', error);
      throw new InternalServerErrorException('Failed to process booking request');
    }
  }

  async findAll() {
    return await this.bookingsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return await this.bookingsRepository.findOne({ where: { id } });
  }
}
