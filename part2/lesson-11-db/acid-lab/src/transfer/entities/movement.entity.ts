import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, { nullable: false })
  from: Account;

  @ManyToOne(() => Account, { nullable: false })
  to: Account;

  @Column('numeric')
  amount: number;

  @CreateDateColumn()
  created_at: Date;
}