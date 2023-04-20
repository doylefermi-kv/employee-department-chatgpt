import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { LeaveType } from './leaveType.entity';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  status!: string;

  @ManyToOne(() => Employee, (employee) => employee.leaves)
  employee!: Employee;

  @ManyToOne(() => LeaveType, (leaveType) => leaveType.leaves)
  leaveType!: LeaveType;
}
