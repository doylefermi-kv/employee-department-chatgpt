import { IsString, IsNumber, IsDateString, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { Department } from '../entities/department.entity';

export class EditEmployeeDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  experience!: number;

  @IsNotEmpty()
  @IsDateString()
  joiningDate!: Date;

  @IsNotEmpty()
  departments!: Department[];

  @IsNotEmpty()
  @IsString()
  role!: string;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}
