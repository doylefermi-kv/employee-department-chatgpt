import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  addressLine1!: string;

  @Column({ nullable: true })
  addressLine2!: string;

  @Column({ nullable: false })
  district!: string;

  @Column({ nullable: false })
  state!: string;

  @Column({ nullable: false })
  country!: string;
}
