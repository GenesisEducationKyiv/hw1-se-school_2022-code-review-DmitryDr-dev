import {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  UpdateCustomerStatusRequestDto,
  UpdateCustomerStatusResponseDto,
} from '../dto';

export interface ICustomerService {
  createCustomer(
    data: CreateCustomerRequestDto,
  ): Promise<CreateCustomerResponseDto>;

  updateCustomerStatus(
    data: UpdateCustomerStatusRequestDto,
  ): Promise<UpdateCustomerStatusResponseDto>;
}
