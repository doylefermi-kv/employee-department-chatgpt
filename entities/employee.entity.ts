import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  experience: number;

  @Column()
  joiningDate: Date;

  @Column()
  role: string;

  @Column()
  status: string;

  @Column()
  address: string;

  @OneToOne(() => Department, (department) => department.employee)
  @JoinColumn()
  department: Department;
}
