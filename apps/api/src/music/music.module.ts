import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [MusicService],
  controllers: [MusicController],
  exports: [MusicService],
})
export class MusicModule {}
