import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ChatGateway } from './chat.gateway';
import { StoreModule } from '../store/store.module'; 

@Module({
  imports: [RedisModule, StoreModule], 
  providers: [ChatGateway],
})
export class WsModule {}
