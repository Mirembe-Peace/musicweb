import { Repository } from 'typeorm';
import { ArtistImage } from './entities/image.entity';
export declare class ImagesService {
    private readonly imageRepository;
    constructor(imageRepository: Repository<ArtistImage>);
    findAll(): Promise<ArtistImage[]>;
    findOne(id: string): Promise<ArtistImage>;
    create(createImageDto: any): Promise<ArtistImage>;
    update(id: string, updateImageDto: any): Promise<ArtistImage>;
    remove(id: string): Promise<void>;
}
