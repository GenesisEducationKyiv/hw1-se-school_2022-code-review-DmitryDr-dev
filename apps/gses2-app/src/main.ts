import { NestFactory } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DI_TOKEN } from './common/constants/di-token';
import { HttpExceptionFilter } from './common/filters';
import { ValidationPipe } from './common/pipes';

async function bootstrap(): Promise<void> {
  const PORT = process.env.APP_PORT || 3000;
  const app = await NestFactory.create(AppModule);
  const logger = app.get<ClientProxy>(DI_TOKEN.LoggerRbqToken);

  app.setGlobalPrefix('gses2.app/api');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    logger.emit('debug', {
      name: bootstrap.name,
      timeStamp: new Date().toISOString(),
      message: `Server runs on port: ${PORT}`,
      type: 'debug',
    });
  });
}

bootstrap();
