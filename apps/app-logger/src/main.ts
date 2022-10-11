import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLoggerModule } from './app-logger.module';
import { ExceptionFilter } from './common/filters';
import { CustomLoggerService } from './custom-logger/service';

async function bootstrap(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(
    AppLoggerModule,
  );
  const configService = appContext.get(ConfigService);
  const RBQ_USER = configService.get<string>('RBQ_USER');
  const RBQ_PASS = configService.get<string>('RBQ_PASS');
  const RBQ_HOST = configService.get<string>('RBQ_HOST');
  const RBQ_PORT = configService.get<number>('RBQ_PORT');
  const RBQ_QUEUE = configService.get<string>('RBQ_LOGGER_QUEUE');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppLoggerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RBQ_USER}:${RBQ_PASS}@${RBQ_HOST}:${RBQ_PORT}`],
        queue: `${RBQ_QUEUE}`,
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  const loggerService = app.get<CustomLoggerService>(CustomLoggerService);

  app.useGlobalFilters(new ExceptionFilter(loggerService));
  app.listen().then(() => {
    loggerService.debug({
      name: bootstrap.name,
      timeStamp: new Date().toISOString(),
      message: 'App logger microservice is running',
      type: 'debug',
    });
  });
  appContext.close();
}

bootstrap();
