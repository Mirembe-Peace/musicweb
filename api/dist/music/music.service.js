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
exports.MusicService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const song_entity_1 = require("./entities/song.entity");
let MusicService = class MusicService {
    songRepository;
    constructor(songRepository) {
        this.songRepository = songRepository;
    }
    async findAll() {
        return this.songRepository.find();
    }
    async findOne(id) {
        const song = await this.songRepository.findOne({ where: { id } });
        if (!song)
            throw new common_1.NotFoundException(`Song with ID ${id} not found`);
        return song;
    }
    async create(createSongDto) {
        const song = this.songRepository.create(createSongDto);
        return this.songRepository.save(song);
    }
    async update(id, updateSongDto) {
        const song = await this.findOne(id);
        Object.assign(song, updateSongDto);
        return this.songRepository.save(song);
    }
    async remove(id) {
        const song = await this.findOne(id);
        await this.songRepository.remove(song);
    }
};
exports.MusicService = MusicService;
exports.MusicService = MusicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(song_entity_1.Song)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MusicService);
//# sourceMappingURL=music.service.js.map