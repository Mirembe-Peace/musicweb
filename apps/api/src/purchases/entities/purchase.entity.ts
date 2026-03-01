import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerEmail: string;

  @Column({ nullable: true })
  buyerPhone: string;

  @Column()
  paymentId: string;

  @Column({ unique: true })
  downloadToken: string;

  @Column({ type: 'timestamp', nullable: true })
  downloadExpiresAt: Date;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, COMPLETED, EXPIRED

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true, eager: true })
  items: PurchaseItem[];
}
