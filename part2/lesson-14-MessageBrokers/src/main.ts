import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConsumerMicroserviceConfig } from './kafka/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(kafkaConsumerMicroserviceConfig); // comment this to test retry
  await app.startAllMicroservices(); // comment this to test retry

  await app.listen(3000);
}
bootstrap();