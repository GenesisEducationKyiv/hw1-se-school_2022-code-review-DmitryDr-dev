import { IsEmail, IsString } from 'class-validator';
import { CustomerStatus } from '../model';

export class CreateCustomerRequestDto {
  @IsString({ message: 'This value should be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'This value should be a string' })
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
}
