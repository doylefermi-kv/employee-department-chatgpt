import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Leave } from './leave.entity';

@Entity()
export class LeaveType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true
  })
  name!: string;

  @Column()
  maxDays!: number;

  @OneToMany(() => Leave, (leave) => leave.leaveType)
  leaves!: Leave[];
}
