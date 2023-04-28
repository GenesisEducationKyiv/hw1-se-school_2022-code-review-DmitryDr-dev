import {
  CreateCustomerRequestDto,
  UpdateCustomerStatusRequestDto,
} from '../dto';
import { Customer } from '../model';

export interface ICustomerRepository {
  createCustomer(data: CreateCustomerRequestDto): Promise<Customer>;

  updateCustomerStatus(data: UpdateCustomerStatusRequestDto): Promise<Customer>;
}
