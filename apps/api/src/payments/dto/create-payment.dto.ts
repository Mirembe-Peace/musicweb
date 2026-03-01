import { IsNumber, IsString, IsEmail, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  description: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  callbackUrl: string;

  @IsOptional()
  @IsString()
  notification_id?: string;
}
