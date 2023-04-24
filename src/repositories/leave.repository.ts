import { LessThanOrEqual, MoreThanOrEqual, Not, Repository, getRepository } from 'typeorm';
import { Leave } from '../entities/leave.entity';
import { LeaveType } from 'entities/leaveType.entity';

export class LeaveRepository {
  private repository: Repository<Leave>;

  constructor() {
    this.repository = getRepository(Leave);
  }

  async createLeave(leave): Promise<Leave> {
    return this.repository.save(leave);
  }

  async getLeaveById(leaveId: number): Promise<Leave> {
    return this.repository.findOneOrFail(leaveId);
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return this.repository.find({
      where: {
        employeeId: employeeId,
      },
    });
  }

  async getAllLeaves(): Promise<Leave[]> {
    return this.repository.find();
  }

  async getRemainingLeaves(
    employeeId: number,
    leaveTypes: LeaveType[]
  ): Promise<{ leaveType: number; remainingDays: number }[]> {
    const leaveCounts = await this.repository
      .createQueryBuilder("leave")
      .select("leave.leaveTypeId", "leaveType")
      .addSelect("COUNT(*)", "count")
      .where("leave.employeeId = :employeeId", { employeeId })
      .andWhere("leave.status = :status", { status: "APPROVED" })
      .groupBy("leave.leaveTypeId")
      .getRawMany<{ leaveType: number; count: string }>();

    const leaveCountsMap = new Map<number, number>();
    for (const { leaveType, count } of leaveCounts) {
      leaveCountsMap.set(leaveType, parseInt(count));
    }

    const remainingLeaves = leaveTypes.map((leaveType) => {
      const count = leaveCountsMap.get(leaveType.id) || 0;
      const remainingDays = leaveType.maxDays - count;
      return { leaveType: leaveType.id, remainingDays };
    });

    return remainingLeaves;
  }

  async getOverlappingLeavesOfEmployee(employeeId, startDate, endDate): Promise<Leave[]> {
    const overlappingLeaves = await this.repository.find({
      where: {
        employee: {
          id: employeeId,
        },
        status: Not('Cancelled'),
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
      },
    });
    return overlappingLeaves;
  }

  async getApprovedLeaveCountInCurrentYear(employeeId, leaveTypeId, currentYear) {
    return this.repository.count({
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
  }
}
