import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DI_TOKEN } from '../common/constants/di-token';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DI_TOKEN.OrchestratorRbqToken,
      useFactory: (configService: ConfigService) => {
        const RBQ_USER = configService.get<string>('RBQ_USER');
        const RBQ_PASS = configService.get<string>('RBQ_PASS');
        const RBQ_HOST = configService.get<string>('RBQ_HOST');
        const RBQ_PORT = configService.get<number>('RBQ_PORT');
        const RBQ_ORCHESTRATOR_QUEUE = configService.get<string>(
          'RBQ_ORCHESTRATOR_QUEUE',
        );

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${RBQ_USER}:${RBQ_PASS}@${RBQ_HOST}:${RBQ_PORT}`],
            queue: `${RBQ_ORCHESTRATOR_QUEUE}`,
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DI_TOKEN.OrchestratorRbqToken],
})
export class OrchestratorModule {}
