import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationAppModule } from './notification-app.module';

async function bootstrap(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(
    NotificationAppModule,
  );
  const configService = appContext.get(ConfigService);
  const RBQ_USER = configService.get<string>('RBQ_USER');
  const RBQ_PASS = configService.get<string>('RBQ_PASS');
  const RBQ_HOST = configService.get<string>('RBQ_HOST');
  const RBQ_PORT = configService.get<number>('RBQ_PORT');
  const RBQ_QUEUE = configService.get<string>('RBQ_NOTIFICATION_QUEUE');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationAppModule,
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

  app.listen().then(() => {
    console.info('Notification App is running');
  });
  appContext.close();
}

bootstrap();
