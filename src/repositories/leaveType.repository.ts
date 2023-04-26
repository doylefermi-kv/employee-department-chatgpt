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

  async findOne(id: number): Promise<LeaveType> {
    return this.repository.findOne(id);
  }

  async update(leaveType: LeaveType): Promise<any> {
    return this.repository.update(leaveType.id, { name: leaveType.name, maxDays: leaveType.maxDays });
  }

  async findOneOrFail(id: number): Promise<LeaveType> {
    return this.repository.findOneOrFail(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
