import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ClientProxy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { DI_TOKEN } from './common/constants';
import { ExceptionFilter } from './common/filters';
import { CustomerAppModule } from './customer-app.module';

async function bootstrap(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(
    CustomerAppModule,
  );
  const configService = appContext.get(ConfigService);
  const RBQ_USER = configService.get<string>('RBQ_USER');
  const RBQ_PASS = configService.get<string>('RBQ_PASS');
  const RBQ_HOST = configService.get<string>('RBQ_HOST');
  const RBQ_PORT = configService.get<number>('RBQ_PORT');
  const RBQ_QUEUE = configService.get<string>('RBQ_CUSTOMER_QUEUE');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CustomerAppModule,
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
  const logger = app.get<ClientProxy>(DI_TOKEN.LoggerRbqToken);

  app.useGlobalFilters(new ExceptionFilter(logger));
  app.listen().then(() => {
    logger.emit('debug', {
      name: bootstrap.name,
      timeStamp: new Date().toISOString(),
      message: `Customer App is running`,
      type: 'debug',
    });
  });
  appContext.close();
}

bootstrap();
