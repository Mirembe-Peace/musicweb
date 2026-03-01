import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistImage } from './entities/image.entity';

import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistImage])],
  controllers: [ImagesController],
  providers: [ImagesService],
})

export class ImagesModule {}
