import { MusicService } from './music.service';
export declare class MusicController {
    private readonly musicService;
    constructor(musicService: MusicService);
    create(createSongDto: any): Promise<import("./entities/song.entity").Song>;
    findAll(): Promise<import("./entities/song.entity").Song[]>;
    findOne(id: string): Promise<import("./entities/song.entity").Song>;
    update(id: string, updateSongDto: any): Promise<import("./entities/song.entity").Song>;
    remove(id: string): Promise<void>;
}
