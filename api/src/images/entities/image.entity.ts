import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ImageType {
  ARTIST = 'ARTIST',
  GALLERY = 'GALLERY',
}

@Entity('images')
export class ArtistImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: ImageType,
    default: ImageType.GALLERY,
  })
  type: ImageType;

  @Column({ nullable: true })
  description: string;
}
