import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { AddressDto } from './address.dto';

export class EditEmployeeDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  experience: number;

  @IsNotEmpty()
  @IsDateString()
  joiningDate: Date;

  @IsNotEmpty()
  departments: Department[];

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
