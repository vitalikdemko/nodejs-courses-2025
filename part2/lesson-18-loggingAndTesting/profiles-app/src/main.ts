import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorLoggingFilter } from './common/http-error-logging.filter'; 
import { AppLogger } from './common/logger.service'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const logger = app.get(AppLogger);
  app.useGlobalFilters(new HttpErrorLoggingFilter(logger));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
