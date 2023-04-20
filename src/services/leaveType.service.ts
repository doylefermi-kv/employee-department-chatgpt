import { LeaveTypeRepository } from 'repositories/leaveType.repository';
import { LeaveType } from '../entities/leaveType.entity';

export class LeaveTypeService {
  private leaveTypeRepository: LeaveTypeRepository;

  constructor(leaveTypeRepository: LeaveTypeRepository) {
    this.leaveTypeRepository = leaveTypeRepository;
  }

  async createLeaveType(name: string, maxDays: number): Promise<LeaveType> {
    const leaveType = new LeaveType();
    leaveType.name = name;
    leaveType.maxDays = maxDays;
    return this.leaveTypeRepository.save(leaveType);
  }

  async getLeaveTypes(): Promise<LeaveType[]> {
    return this.leaveTypeRepository.find();
  }

  async getLeaveTypeById(id: number): Promise<LeaveType> {
    return this.leaveTypeRepository.findOneOrFail(id);
  }

  async updateLeaveType(id: number, name: string, maxDays: number): Promise<LeaveType> {
    const leaveType = await this.getLeaveTypeById(id);
    leaveType.name = name;
    leaveType.maxDays = maxDays;
    return this.leaveTypeRepository.save(leaveType);
  }

  async deleteLeaveType(id: number): Promise<void> {
    await this.leaveTypeRepository.delete(id);
  }
}
