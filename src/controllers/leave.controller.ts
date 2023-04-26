import { NextFunction, Request, Response } from 'express';
import { LeaveService } from '../services/leave.service';
import { MarkLeaveDto } from '../dto/mark-leave.dto';
import { ConfigureLeaveTypeDto } from '../dto/configure-leave-type.dto';

export class LeaveController {
  private leaveService: LeaveService;

  constructor(leaveService: LeaveService) {
    this.leaveService = leaveService;
  }

  public markLeave = async (req: any, res: Response, next: NextFunction) => {
    try {
      let { employeeId, leaveTypeId, startDate, endDate } = req.body;
      // TODO: Allow only admins to mark leaves for employees
      if(!employeeId) {
        // If the employeeId is not provided, then the leave is marked for the logged in user.
        employeeId = req.userId;
      }
      const leave = await this.leaveService.markLeave(employeeId, leaveTypeId, startDate, endDate);
      res.status(201).json(leave);
    } catch (error) {
      next(error);
    }
  };

  public cancelLeave = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { leaveId } = req.params;
      await this.leaveService.cancelLeave(Number(leaveId));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  public getLeavesByEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;
      const leaves = await this.leaveService.getLeavesByEmployee(Number(employeeId));
      res.json(leaves);
    } catch (error) {
      next(error);
    }
  };

  public getAllLeaves = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaves = await this.leaveService.getAllLeaves();
      res.json(leaves);
    } catch (error) {
      next(error);
    }
  };

  public getRemainingLeaves = async (req: any, res: Response, next: NextFunction) => {
    try {
      let { employeeId } = req.params;

      if(!employeeId || employeeId !== req.userId) {
        // If the employeeId is not provided, then the remaining leaves of the logged in user is returned.
        employeeId = req.userId;
      }
      const remainingLeaves = await this.leaveService.getRemainingLeaves(Number(employeeId));
      res.json(remainingLeaves);
    } catch (error) {
      next(error);
    }
  };
}
