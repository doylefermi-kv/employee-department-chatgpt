import { getRepository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Leave } from '../entities/leave.entity';
import { LeaveType } from '../entities/leaveType.entity';

export class LeaveService {
  private leaveRepository = getRepository(Leave);
  private employeeRepository = getRepository(Employee);
  private leaveTypeRepository = getRepository(LeaveType);

  async markLeave(employeeId: number, leaveTypeId: number, startDate: Date, endDate: Date): Promise<Leave> {
    // check if the employee exists
    const employee = await this.employeeRepository.findOne(employeeId);
    if (!employee) {
      throw new Error(`Employee with id ${employeeId} not found`);
    }

    // check if the leave type exists
    const leaveType = await this.leaveTypeRepository.findOne(leaveTypeId);
    if (!leaveType) {
      throw new Error(`Leave type with id ${leaveTypeId} not found`);
    }

    // check if the leave request is in the current year
    const currentYear = new Date().getFullYear();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    if (startYear !== currentYear || endYear !== currentYear) {
      throw new Error('Leave request should be within the current year');
    }

    // check if the leave request overlaps with existing leaves
    const overlappingLeaves = await this.leaveRepository.find({
      where: {
        employee: {
          id: employeeId,
        },
        status: Not('Cancelled'),
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
      },
    });
    if (overlappingLeaves.length > 0) {
      throw new Error('Leave request overlaps with existing leaves');
    }

    // check if the leave request exceeds the maximum allowed limit
    const leavesTaken = await this.leaveRepository.count({
      where: {
        employee: {
          id: employeeId,
        },
        leaveType: {
          id: leaveTypeId,
        },
        status: 'APPROVED',
        startDate: MoreThanOrEqual(new Date(currentYear, 0, 1)),
        endDate: LessThanOrEqual(new Date(currentYear, 11, 31)),
      },
    });
    const remainingDays = leaveType.maxDays - leavesTaken;
    if (remainingDays <= 0) {
      throw new Error(`Leave request exceeds the maximum allowed limit of ${leaveType.maxDays} days for leave type '${leaveType.name}'`);
    }

    // create the leave entity and save to the database
    const leave = new Leave();
    leave.startDate = startDate;
    leave.endDate = endDate;
    leave.employee = employee;
    leave.leaveType = leaveType;
    leave.status = 'APPROVED';
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
