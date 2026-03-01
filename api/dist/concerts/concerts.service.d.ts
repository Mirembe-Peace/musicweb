import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';
export declare class ConcertsService {
    private readonly concertRepository;
    constructor(concertRepository: Repository<Concert>);
    create(createConcertDto: any): Promise<Concert[]>;
    findAll(): Promise<Concert[]>;
    getActive(): Promise<Concert | null>;
    findOne(id: string): Promise<Concert | null>;
    update(id: string, updateConcertDto: any): Promise<Concert | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
