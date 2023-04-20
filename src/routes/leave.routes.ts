import { LeaveController } from 'controllers/leave.controller';
import { LeaveType } from 'entities/leaveType.entity';
import { Router } from 'express';
import { EmployeeRepository } from 'repositories/employee.repository';
import { LeaveRepository } from 'repositories/leave.repository';
import { EmployeeService } from 'services/employee.service';
import { LeaveService } from 'services/leave.service';
import { getRepository } from 'typeorm';


export class LeaveRoutes {
  private router: Router;
  private readonly leaveController: LeaveController

  constructor() {
    this.router = Router();
    this.leaveController = new LeaveController(
        new LeaveService(new LeaveRepository(), new EmployeeService(new EmployeeRepository()), getRepository(LeaveType)))
    this.routes();
  }

  private routes(): void {
    this.router.post('/leave', async (req, res, next) => {
      try {
        await this.leaveController.markLeave(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.delete('/leave/:leaveId', async (req, res, next) => {
      try {
        await this.leaveController.cancelLeave(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/leave/:employeeId', async (req, res, next) => {
      try {
        await this.leaveController.getLeavesByEmployee(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/leave', async (req, res, next) => {
      try {
        await this.leaveController.getAllLeaves(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/leave/remaining/:employeeId', async (req, res, next) => {
      try {
        await this.leaveController.getRemainingLeaves(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
