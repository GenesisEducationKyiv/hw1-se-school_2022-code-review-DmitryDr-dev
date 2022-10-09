import { Module } from '@nestjs/common';
import { CustomerController } from './controller/customer.controller';

@Module({
  controllers: [CustomerController],
})
export class CustomerModule {}
