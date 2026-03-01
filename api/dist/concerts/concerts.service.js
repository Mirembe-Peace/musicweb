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
exports.ConcertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const concert_entity_1 = require("./entities/concert.entity");
let ConcertsService = class ConcertsService {
    concertRepository;
    constructor(concertRepository) {
        this.concertRepository = concertRepository;
    }
    create(createConcertDto) {
        const concert = this.concertRepository.create(createConcertDto);
        return this.concertRepository.save(concert);
    }
    findAll() {
        return this.concertRepository.find();
    }
    async getActive() {
        return this.concertRepository.findOne({ where: { isEnabled: true } });
    }
    findOne(id) {
        return this.concertRepository.findOne({ where: { id } });
    }
    async update(id, updateConcertDto) {
        await this.concertRepository.update(id, updateConcertDto);
        return this.findOne(id);
    }
    remove(id) {
        return this.concertRepository.delete(id);
    }
};
exports.ConcertsService = ConcertsService;
exports.ConcertsService = ConcertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(concert_entity_1.Concert)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConcertsService);
//# sourceMappingURL=concerts.service.js.map