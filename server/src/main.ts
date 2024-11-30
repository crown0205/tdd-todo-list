import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = configService.get('PORT') || 3001;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Database connection: ${configService.get('DB_DATABASE')}`);
}
bootstrap();
