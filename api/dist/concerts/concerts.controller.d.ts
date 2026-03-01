import { ConcertsService } from './concerts.service';
export declare class ConcertsController {
    private readonly concertsService;
    constructor(concertsService: ConcertsService);
    create(createConcertDto: any): Promise<import("./entities/concert.entity").Concert[]>;
    findAll(): Promise<import("./entities/concert.entity").Concert[]>;
    getActive(): Promise<import("./entities/concert.entity").Concert | null>;
    findOne(id: string): Promise<import("./entities/concert.entity").Concert | null>;
    update(id: string, updateConcertDto: any): Promise<import("./entities/concert.entity").Concert | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
