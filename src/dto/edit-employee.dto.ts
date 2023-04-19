import { IsString, IsNumber, IsDateString, IsNotEmpty, ValidateNested, IsOptional, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { Department } from '../entities/department.entity';

export class EditEmployeeDto {
  @IsNotEmpty()
  @IsNumberString()
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

  @IsOptional()
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
