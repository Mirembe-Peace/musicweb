"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const image_entity_1 = require("./entities/image.entity");
let ImagesService = class ImagesService {
    imageRepository;
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }
    async findAll() {
        return this.imageRepository.find();
    }
    async findOne(id) {
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image)
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        return image;
    }
    async create(createImageDto) {
        const image = this.imageRepository.create(createImageDto);
        return this.imageRepository.save(image);
    }
    async update(id, updateImageDto) {
        const image = await this.findOne(id);
        Object.assign(image, updateImageDto);
        return this.imageRepository.save(image);
    }
    async remove(id) {
        const image = await this.findOne(id);
        await this.imageRepository.remove(image);
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_entity_1.ArtistImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImagesService);
//# sourceMappingURL=images.service.js.map