import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

void (async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
})();
