import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from './logger/logger.module';
import { Subscriber } from './subscription/model';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    LoggerModule,
    SubscriptionModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('PG_DB_HOST'),
        port: configService.get<number>('PG_DB_PORT'),
        username: configService.get<string>('PG_DB_USER'),
        password: configService.get<string>('PG_DB_PASSWORD'),
        database: configService.get<string>('PG_NOTIFICATION_DB'),
        models: [Subscriber],
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class NotificationAppModule {}
