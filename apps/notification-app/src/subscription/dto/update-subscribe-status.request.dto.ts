import { IsEmail, IsNumber, IsString } from 'class-validator';
import { SubscriberStatus } from '../model';

export class UpdateSubscriberStatusRequestDto {
  @IsNumber({}, { message: 'This value should be a number' })
  id: number;

  @IsString({ message: 'This value should be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'This value should be a string' })
  status: typeof SubscriberStatus[keyof typeof SubscriberStatus];
}
