import { getRepository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Leave } from '../entities/leave.entity';
import { LeaveType } from '../entities/leaveType.entity';

export class LeaveService {
  private leaveRepository = getRepository(Leave);
  private employeeRepository = getRepository(Employee);
  private leaveTypeRepository = getRepository(LeaveType);

  async markLeave(employeeId: number, leaveTypeId: number, startDate: Date, endDate: Date): Promise<Leave> {
    const employee = await this.employeeRepository.findOneOrFail(employeeId);
    const leaveType = await this.leaveTypeRepository.findOneOrFail(leaveTypeId);
    const leave = new Leave();
    leave.startDate = startDate;
    leave.endDate = endDate;
    leave.employee = employee;
    leave.leaveType = leaveType;
    leave.status = 'Pending';
    return this.leaveRepository.save(leave);
  }

  async cancelLeave(leaveId: number): Promise<void> {
    const leave = await this.leaveRepository.findOneOrFail(leaveId);
    leave.status = 'Cancelled';
    await this.leaveRepository.save(leave);
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return this.leaveRepository.find({
      where: {
        employee: {
          id: employeeId,
        },
      },
    });
  }

  async getAllLeaves(): Promise<Leave[]> {
    return this.leaveRepository.find();
  }

  async configureMaxLeaves(leaveTypeId: number, maxDays: number): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOneOrFail(leaveTypeId);
    leaveType.maxDays = maxDays;
    return this.leaveTypeRepository.save(leaveType);
  }

  async getRemainingLeaves(employeeId: number): Promise<{ leaveType: LeaveType; remainingDays: number }[]> {
    const employee = await this.employeeRepository.findOneOrFail(employeeId, {
      relations: ['leaves', 'leaves.leaveType'],
    });
    const leaveTypes = await this.leaveTypeRepository.find();
    return leaveTypes.map((leaveType) => {
      const leavesTaken = employee.leaves.filter((leave) => leave.leaveType.id === leaveType.id);
      const remainingDays = leaveType.maxDays - leavesTaken.length;
      return { leaveType, remainingDays };
    });
  }
}
