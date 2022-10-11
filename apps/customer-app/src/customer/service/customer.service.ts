import { Injectable } from '@nestjs/common';
import {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  UpdateCustomerStatusRequestDto,
  UpdateCustomerStatusResponseDto,
} from '../dto';
import { CustomerRepository } from '../repository';
import { ICustomerService } from './customer.service.interface';

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async createCustomer(
    data: CreateCustomerRequestDto,
  ): Promise<CreateCustomerResponseDto> {
    try {
      const customer = await this.customerRepository.createCustomer(data);

      return customer;
    } catch (error) {
      throw new Error(
        `Error occurred while creating new customer: ${error.message}`,
      );
    }
  }

  public async updateCustomerStatus(
    data: UpdateCustomerStatusRequestDto,
  ): Promise<UpdateCustomerStatusResponseDto> {
    try {
      const updatedCustomer =
        await this.customerRepository.updateCustomerStatus(data);

      return updatedCustomer;
    } catch (error) {
      throw new Error(
        `Error occurred while updating customer status: ${error.message}`,
      );
    }
  }
}
