import { getRepository, Repository } from 'typeorm';
import { LeaveType } from '../entities/leaveType.entity';

export class LeaveTypeRepository {
  private repository: Repository<LeaveType>;

  constructor() {
    this.repository = getRepository(LeaveType);
  }

  async save(leaveType: LeaveType): Promise<LeaveType> {
    return this.repository.save(leaveType);
  }

  async find(): Promise<LeaveType[]> {
    return this.repository.find();
  }

  async findOneOrFail(id: number): Promise<LeaveType> {
    return this.repository.findOneOrFail(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
