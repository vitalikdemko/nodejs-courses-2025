import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new ApiKeyGuard(app.get(Reflector)));

  app.enableShutdownHooks();
  process.on('SIGINT', () => {
    console.log('Bye tea‑lovers 👋');
    process.exit();
  });

  const config = new DocumentBuilder()
    .setTitle('Tea Tracker')
    .setDescription('The tea tracking API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
