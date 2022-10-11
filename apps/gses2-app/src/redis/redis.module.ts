import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const RedisClientToken = Symbol.for('RedisClient');

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RedisClientToken,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisClientToken],
})
export class RedisModule {}
