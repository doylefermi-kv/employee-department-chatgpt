import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class MarkLeaveDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  leaveTypeId: number;
}
