import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { Movement } from './entities/movement.entity';

@Injectable()
export class TransferService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Movement)
    private readonly movementRepo: Repository<Movement>,
  ) {}

  async transfer(fromId: string, toId: string, amount: number) {
    return this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(Account, { where: { id: fromId } });
      const to = await manager.findOne(Account, { where: { id: toId } });

      if (!from || !to) throw new Error('Account not found');
      if (Number(from.balance) < amount)
        throw new Error('Not enough balance');

      from.balance = Number(from.balance) - amount;
      to.balance = Number(to.balance) + amount;

      await manager.save(from);
      await manager.save(to);

      const movement = manager.create(Movement, {
        from,
        to,
        amount,
      });

      await manager.save(movement);

      return movement;
    });
  }
}
