import { IsString, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  addressLine1!: string;

  @IsNotEmpty()
  @IsString()
  addressLine2!: string;

  @IsNotEmpty()
  @IsString()
  district!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;
}
