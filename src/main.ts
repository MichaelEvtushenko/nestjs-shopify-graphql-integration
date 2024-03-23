import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Shopify Service API')
    .setDescription('The Shopify Service API description')
    .setVersion('1.0')
    .addTag('shopify')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter(app.get(Logger)));
  app.useGlobalPipes(new ValidationPipe());

  // Rate Limiting
  // app.useGlobalPipes(new RateLimiterModule());

  await app.listen(3000);
}

bootstrap();
