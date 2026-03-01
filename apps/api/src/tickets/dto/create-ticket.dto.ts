import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  concertId: string;

  @IsString()
  buyerName: string;

  @IsEmail()
  buyerEmail: string;

  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @IsString()
  callbackUrl: string;
}
