import { IsEmail, IsNumber, IsString } from 'class-validator';
import { CustomerStatus } from '../model';

export class UpdateCustomerStatusRequestDto {
  @IsNumber({}, { message: 'This value should be a number' })
  id: number;

  @IsString({ message: 'This value should be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'This value should be a string' })
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
}
