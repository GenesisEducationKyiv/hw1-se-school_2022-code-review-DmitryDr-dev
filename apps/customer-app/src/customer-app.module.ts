import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/model';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('PG_DB_HOST'),
        port: configService.get<number>('PG_DB_PORT'),
        username: configService.get<string>('PG_DB_USER'),
        password: configService.get<string>('PG_DB_PASSWORD'),
        database: configService.get<string>('PG_CUSTOMER_DB'),
        models: [Customer],
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class CustomerAppModule {}
