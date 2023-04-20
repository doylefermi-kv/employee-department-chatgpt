import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfigureLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  maxDays: number;
}
