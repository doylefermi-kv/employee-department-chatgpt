import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class ConfigureLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\w-]+$/, {
    message: 'Name must not contain any whitespace',
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  maxDays: number;
}
