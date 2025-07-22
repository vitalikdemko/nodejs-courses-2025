import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { Account } from './entities/account.entity';
import { Movement } from './entities/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Movement])],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}