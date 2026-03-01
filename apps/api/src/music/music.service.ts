import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songRepository.findOne({ where: { id } });
    if (!song) throw new NotFoundException(`Song with ID ${id} not found`);
    return song;
  }

  async create(createSongDto: any): Promise<Song> {
    const song = this.songRepository.create(createSongDto);
    return this.songRepository.save(song);
  }

  async update(id: string, updateSongDto: any): Promise<Song> {
    const song = await this.findOne(id);
    Object.assign(song, updateSongDto);
    return this.songRepository.save(song);
  }

  async remove(id: string): Promise<void> {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
  }
}
