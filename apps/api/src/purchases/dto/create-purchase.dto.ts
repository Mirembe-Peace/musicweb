import { IsArray, IsEmail, IsOptional, IsString, IsUUID, ArrayMinSize } from 'class-validator';

export class CreatePurchaseDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  songIds: string[];

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  callbackUrl: string;
}
