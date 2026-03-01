import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);

  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  async findAllPublic(): Promise<Partial<Song>[]> {
    const songs = await this.songRepository.find();
    return songs.map(({ audioUrl, ...rest }) => rest);
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songRepository.findOne({ where: { id } });
    if (!song) throw new NotFoundException(`Song with ID ${id} not found`);
    return song;
  }

  async findOnePublic(id: string): Promise<Partial<Song>> {
    const song = await this.findOne(id);
    const { audioUrl, ...rest } = song;
    return rest;
  }

  async create(createSongDto: Partial<Song>): Promise<Song> {
    const song = this.songRepository.create(createSongDto);
    const saved = await this.songRepository.save(song);

    // Trigger preview generation if audioUrl is provided
    if (saved.audioUrl) {
      this.generatePreview(saved.id).catch((err) =>
        this.logger.error(`Preview generation failed for ${saved.id}`, err),
      );
    }

    return saved;
  }

  async update(id: string, updateSongDto: any): Promise<Song> {
    const song = await this.findOne(id);
    const hadAudioUrl = song.audioUrl;
    Object.assign(song, updateSongDto);
    const saved = await this.songRepository.save(song);

    // Re-generate preview if audioUrl changed
    if (saved.audioUrl && saved.audioUrl !== hadAudioUrl) {
      this.generatePreview(saved.id).catch((err) =>
        this.logger.error(`Preview generation failed for ${saved.id}`, err),
      );
    }

    return saved;
  }

  async remove(id: string): Promise<void> {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
  }

  async generatePreview(songId: string): Promise<void> {
    const song = await this.findOne(songId);
    if (!song.audioUrl) {
      this.logger.warn(`Song ${songId} has no audioUrl, skipping preview`);
      return;
    }

    try {
      const ffmpeg = require('fluent-ffmpeg');
      const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
      ffmpeg.setFfmpegPath(ffmpegPath);

      const tempDir = os.tmpdir();
      const inputFile = path.join(tempDir, `input-${songId}.mp3`);
      const outputFile = path.join(tempDir, `preview-${songId}.mp3`);

      // Download audio from URL to temp file
      const response = await fetch(song.audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to download audio: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(inputFile, Buffer.from(arrayBuffer));

      // Extract first 20 seconds
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputFile)
          .setStartTime(0)
          .setDuration(20)
          .output(outputFile)
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .run();
      });

      // Upload to S3
      const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
      const s3 = new S3Client({
        region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
          secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
        },
      });

      const bucket = this.configService.get<string>('AWS_S3_BUCKET', 'ashabamusic');
      const key = `previews/${songId}.mp3`;

      const previewData = fs.readFileSync(outputFile);
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: previewData,
          ContentType: 'audio/mpeg',
        }),
      );

      // Update song with preview URL
      const previewUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
      song.previewUrl = previewUrl;
      await this.songRepository.save(song);

      // Cleanup temp files
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);

      this.logger.log(`Preview generated for song ${songId}: ${previewUrl}`);
    } catch (error) {
      this.logger.error(`Failed to generate preview for ${songId}`, error);
    }
  }

  async getCount(): Promise<number> {
    return this.songRepository.count();
  }
}
