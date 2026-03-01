import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
export declare class MusicService {
    private readonly songRepository;
    constructor(songRepository: Repository<Song>);
    findAll(): Promise<Song[]>;
    findOne(id: string): Promise<Song>;
    create(createSongDto: any): Promise<Song>;
    update(id: string, updateSongDto: any): Promise<Song>;
    remove(id: string): Promise<void>;
}
