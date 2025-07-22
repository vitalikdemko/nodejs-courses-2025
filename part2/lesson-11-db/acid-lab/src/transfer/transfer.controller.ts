import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async transfer(@Body() body: { fromId: string; toId: string; amount: number }) {
    try {
      const result = await this.transferService.transfer(
        body.fromId,
        body.toId,
        body.amount,
      );
      return { message: 'Transfer successful', movement: result };
    } catch (err) {
      throw new HttpException(
        { message: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}