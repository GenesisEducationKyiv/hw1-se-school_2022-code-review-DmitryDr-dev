import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateCustomerRequestDto,
  UpdateCustomerStatusRequestDto,
} from '../dto';
import { Customer } from '../model';
import { ICustomerRepository } from './customer.repository.interface';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  public async createCustomer(
    data: CreateCustomerRequestDto,
  ): Promise<Customer> {
    try {
      const customer = await this.customerModel.create(data);

      return customer;
    } catch (error) {
      throw new Error(
        `Error occurred while creating new customer: ${error.message}`,
      );
    }
  }

  public async updateCustomerStatus(
    data: UpdateCustomerStatusRequestDto,
  ): Promise<Customer> {
    try {
      const customer = await this.customerModel.findByPk(data.id);

      if (!customer) throw new Error(`Customer with ${data.id} not found`);

      customer.status = data.status;
      await customer.save();

      return customer;
    } catch (error) {
      throw new Error(
        `Error occurred while updating customer status: ${error.message}`,
      );
    }
  }
}
