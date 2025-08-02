import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class LoggerController {

  //producer
  @MessagePattern('events.notifications')
  handleUserSignedUp(@Payload() message: any) {
    console.log('message received:', message);
  }
}
