import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async sendUserSignedUpEvent(user: any) {
    this.kafkaClient.emit('events.notifications', {
      event: 'UserSignedUp',
      data: user,
    });
  }
}