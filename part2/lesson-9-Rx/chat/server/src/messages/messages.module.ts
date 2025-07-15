import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { StoreModule } from '../store/store.module'; 

@Module({
  imports: [StoreModule], 
  controllers: [MessagesController],
})
export class MessagesModule {}
