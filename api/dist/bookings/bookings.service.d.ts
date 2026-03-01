import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
export declare class BookingsService {
    private readonly bookingsRepository;
    private readonly logger;
    constructor(bookingsRepository: Repository<Booking>);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<Booking | null>;
}
