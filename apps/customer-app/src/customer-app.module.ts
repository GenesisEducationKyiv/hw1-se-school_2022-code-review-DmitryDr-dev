import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    LoggerModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class CustomerAppModule {}
