import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  audioUrl: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ nullable: true })
  albumId: string;

  @Column({ nullable: true })
  albumTitle: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  isReleased: boolean;

  @Column({ default: false })
  isUpcoming: boolean;

  @Column({ nullable: true })
  previewUrl: string;
}
