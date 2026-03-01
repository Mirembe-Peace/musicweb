import { IsString, IsEmail, IsOptional, IsNumber, IsIn, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsIn(['WEDDING', 'CORPORATE', 'FESTIVAL', 'PRIVATE', 'OTHER'])
  eventType: 'WEDDING' | 'CORPORATE' | 'FESTIVAL' | 'PRIVATE' | 'OTHER';

  @IsString()
  eventDate: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetUGX?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
