import { IsEmail, IsString } from 'class-validator';
import { SubscriberStatus } from './subscriber-status.enum';

export class CreateSubscriberRequestDto {
  @IsString({ message: 'This value should be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'This value should be a string' })
  status: typeof SubscriberStatus[keyof typeof SubscriberStatus];
}
