import { ImagesService } from './images.service';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    create(createImageDto: any): Promise<import("./entities/image.entity").ArtistImage>;
    findAll(): Promise<import("./entities/image.entity").ArtistImage[]>;
    findOne(id: string): Promise<import("./entities/image.entity").ArtistImage>;
    update(id: string, updateImageDto: any): Promise<import("./entities/image.entity").ArtistImage>;
    remove(id: string): Promise<void>;
}
