import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { kafkaProducerConfig } from '../kafka/kafka.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        //name: 'KAFKA_SERVICE',
        ...kafkaProducerConfig,
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
