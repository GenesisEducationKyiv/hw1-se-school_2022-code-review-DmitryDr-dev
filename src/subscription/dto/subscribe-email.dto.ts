import { IsEmail, IsString } from 'class-validator';

export class SubscribeEmailDto {
  @IsString({ message: 'This value should be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
