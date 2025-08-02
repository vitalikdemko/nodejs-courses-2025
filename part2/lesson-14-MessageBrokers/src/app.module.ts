import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { LoggerController } from './logger/logger.controller';

@Module({
  imports: [ConfigModule.forRoot(), NotificationModule],
  controllers: [LoggerController],
})
export class AppModule {}
