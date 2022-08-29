import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbBinaryTreeModule } from './database/db-binary-tree/db-binary-tree.module';
import { DbStorageModule } from './database/db-storage/db-storage.module';
import { LocalDbModule } from './database/local-db/local-db.module';
import { ExchangeApiModule } from './exchange-api/exchange-api.module';
import { MailModule } from './mail/mail.module';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ExchangeApiModule,
    RateModule,
    DbBinaryTreeModule,
    DbStorageModule,
    LocalDbModule,
    MailModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
