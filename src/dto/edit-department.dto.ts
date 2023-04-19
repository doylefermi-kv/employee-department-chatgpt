import { IsNotEmpty, IsString } from 'class-validator';

export class EditDepartmentDto {  
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    status!: string;

}
