import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Address } from './address.entity';
import { Department } from './department.entity';
import { Leave } from './leave.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  experience!: number;

  @Column()
  joiningDate!: Date;

  @Column()
  role!: string;

  @Column()
  status!: string;

  @ManyToMany(() => Department)
  @JoinTable()
  departments?: Department[];

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address?: Address;

  @OneToMany(() => Leave, (leave) => leave.employee)
  leaves?: Leave[];
}
