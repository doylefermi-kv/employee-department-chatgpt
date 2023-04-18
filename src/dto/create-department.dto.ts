import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {

    @IsNotEmpty()
    @IsString()
    departmentName!: string;

    @IsNotEmpty()
    @IsString()
    status!: string;

}
