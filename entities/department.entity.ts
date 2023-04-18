import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  status: string;

  @OneToOne(() => Employee, (employee) => employee.department)
  employee: Employee;
}
