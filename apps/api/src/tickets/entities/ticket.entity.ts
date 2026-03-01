import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  concertId: string;

  @Column()
  buyerName: string;

  @Column()
  buyerEmail: string;

  @Column({ nullable: true })
  buyerPhone: string;

  @Column({ unique: true })
  ticketCode: string;

  @Column()
  paymentId: string;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, PAID, USED, CANCELLED

  @Column({ type: 'timestamp', nullable: true })
  purchasedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
