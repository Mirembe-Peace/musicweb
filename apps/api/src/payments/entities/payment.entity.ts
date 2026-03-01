import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderTrackingId: string;

  @Column({ nullable: true })
  merchantReference: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'UGX' })
  currency: string;

  @Column()
  description: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: 'OTHER' })
  type: string; // MUSIC_PURCHASE, TICKET, TIP, OTHER

  @Column({ default: 'PENDING' })
  status: string; // PENDING, COMPLETED, FAILED, INVALID

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


// - Defines the Payment table structure in PostgreSQL
// - `@Entity()`: Creates a database table named "payment"
// - Column decorators define:
//   - `@PrimaryGeneratedColumn()`: UUID primary key (auto-generated)
//   - `@Column()`: Regular columns
//   - `@CreateDateColumn()`: Auto-set on creation
//   - `@UpdateDateColumn()`: Auto-updated on modifications

// **Generated SQL:**
// ```sql
// CREATE TABLE payment (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   orderTrackingId VARCHAR UNIQUE NOT NULL,
//   merchantReference VARCHAR,
//   amount DECIMAL(10, 2),
//   currency VARCHAR DEFAULT 'UGX',
//   description VARCHAR NOT NULL,
//   email VARCHAR NOT NULL,
//   phoneNumber VARCHAR,
//   status VARCHAR DEFAULT 'PENDING',
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// );
// ```
