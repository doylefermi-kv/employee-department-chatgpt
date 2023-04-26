import { getRepository } from 'typeorm';
import { Leave } from '../entities/leave.entity';
import { LeaveType } from '../entities/leaveType.entity';
import { HTTPException } from '../middleware/error-handler.middleware';
import { LeaveRepository } from 'repositories/leave.repository';
import { EmployeeService } from './employee.service';
import { LeaveTypeRepository } from 'repositories/leaveType.repository';

export class LeaveService {
  private leaveRepository: LeaveRepository;
  private employeeService: EmployeeService;
  private leaveTypeRepository: LeaveTypeRepository;

  constructor(
    leaveRepository: LeaveRepository,
    employeeService: EmployeeService,
    leaveTypeRepository: LeaveTypeRepository,
  ) {
    this.leaveRepository = leaveRepository;
    this.employeeService = employeeService;
    this.leaveTypeRepository = leaveTypeRepository;
  }


  async markLeave(employeeId: number, leaveTypeId: number, startDate: Date, endDate: Date): Promise<Leave> {
    // check if the employee exists
    const employee = await this.employeeService.getEmployeeById(String(employeeId));
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
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const startYear = startDateObj.getFullYear();
    const endYear = endDateObj.getFullYear();

    if (startYear !== currentYear || endYear !== currentYear) {
      throw new Error('Leave request should be within the current year');
    }

    // check if the leave request overlaps with existing leaves
    const overlappingLeaves = await this.leaveRepository.getOverlappingLeavesOfEmployee(employeeId, startDate, endDate);
    if (overlappingLeaves.length > 0) {
      throw new Error('Leave request overlaps with existing leaves');
    }

    // check if the leave request exceeds the maximum allowed limit
    const leavesTaken = await this.leaveRepository.getApprovedLeaveCountInCurrentYear(employeeId, leaveTypeId, currentYear)
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
    return this.leaveRepository.createLeave(leave);
  }

  async cancelLeave(leaveId: number): Promise<void> {
    const leaveRepository = getRepository(Leave);
    try {
      const leave = await this.leaveRepository.getLeaveById(leaveId);
      leave.status = 'Cancelled';
      await leaveRepository.save(leave);
    } catch (err) {
      throw new HTTPException(404, 'Leave not found');
    }
  };

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return this.leaveRepository.getLeavesByEmployee(employeeId);
  }

  async getAllLeaves(): Promise<Leave[]> {
    return this.leaveRepository.getAllLeaves();
  }

  async configureMaxLeaves(leaveTypeId: number, maxDays: number): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOneOrFail(leaveTypeId);
    leaveType.maxDays = maxDays;
    return this.leaveTypeRepository.save(leaveType);
  }

  async getRemainingLeaves(employeeId: number): Promise<{ leaveType: number; remainingDays: number }[]> {
    const leaveTypes = await this.leaveTypeRepository.find();

    const remainingLeaves = await this.leaveRepository.getRemainingLeaves(employeeId, leaveTypes);
    return remainingLeaves;   
  }
}
