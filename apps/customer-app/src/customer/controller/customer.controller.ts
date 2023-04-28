import { Controller } from '@nestjs/common';
import { EventPattern, RpcException } from '@nestjs/microservices';
import {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  UpdateCustomerStatusRequestDto,
  UpdateCustomerStatusResponseDto,
} from '../dto';
import { CustomerStatus } from '../model';
import { CustomerService } from '../service';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @EventPattern('create-customer')
  public async createCustomer(
    dto: CreateCustomerRequestDto,
  ): Promise<CreateCustomerResponseDto> {
    try {
      const customer = await this.customerService.createCustomer(dto);

      return customer;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @EventPattern('disable-customer')
  public async disableCustomer(
    dto: UpdateCustomerStatusRequestDto,
  ): Promise<UpdateCustomerStatusResponseDto> {
    try {
      const data = { ...dto, status: CustomerStatus.Disabled };

      const customer = await this.customerService.updateCustomerStatus(data);

      return customer;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
