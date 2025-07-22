import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movement } from './movement.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', { default: 0 })
  balance: number;

  @OneToMany(() => Movement, (movement) => movement.from)
  sentMovements: Movement[];

  @OneToMany(() => Movement, (movement) => movement.to)
  receivedMovements: Movement[];
}