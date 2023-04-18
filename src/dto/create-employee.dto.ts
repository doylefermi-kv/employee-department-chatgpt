import { IsString, IsNumber, IsDateString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { Department } from '../entities/department.entity';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsNumber()
  experience!: number;

  @IsNotEmpty()
  @IsDateString()
  joiningDate!: Date;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => Department)
  departments?: Department[];
}
