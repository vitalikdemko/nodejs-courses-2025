import { Module } from '@nestjs/common';
import { Store } from './store';

@Module({
  providers: [Store],
  exports: [Store],
})
export class StoreModule {}