import { IsNotEmpty, IsString } from 'class-validator';

export class EditDepartmentDto {  
    @IsNotEmpty()
    @IsString()
    departmentName!: string;

    @IsNotEmpty()
    @IsString()
    status!: string;

}
