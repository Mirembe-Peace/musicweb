import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistImage } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ArtistImage)
    private readonly imageRepository: Repository<ArtistImage>,
  ) {}

  async findAll(): Promise<ArtistImage[]> {
    return this.imageRepository.find();
  }

  async findOne(id: string): Promise<ArtistImage> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) throw new NotFoundException(`Image with ID ${id} not found`);
    return image;
  }

  async create(createImageDto: any): Promise<ArtistImage> {
    const image = this.imageRepository.create(createImageDto) as unknown as ArtistImage;
    return this.imageRepository.save(image);
  }

  async update(id: string, updateImageDto: any): Promise<ArtistImage> {
    const image = await this.findOne(id);
    Object.assign(image, updateImageDto);
    return this.imageRepository.save(image);
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    await this.imageRepository.remove(image);
  }
}
