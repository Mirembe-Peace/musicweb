import { MerchandiseService } from './merchandise.service';
export declare class MerchandiseController {
    private readonly merchandiseService;
    constructor(merchandiseService: MerchandiseService);
    create(createProductDto: any): Promise<import("./entities/product.entity").Product>;
    findAll(): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: any): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<void>;
}
