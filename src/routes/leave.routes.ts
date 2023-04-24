import { LeaveController } from '../controllers/leave.controller';
import { LeaveType } from '../entities/leaveType.entity';
import { Router } from 'express';
import { EmployeeRepository } from '../repositories/employee.repository';
import { LeaveRepository } from '../repositories/leave.repository';
import { EmployeeService } from '../services/employee.service';
import { LeaveService } from '../services/leave.service';
import { getRepository } from 'typeorm';
import { validateDto } from '../middleware/validate.dto';
import { MarkLeaveDto } from '../dto/mark-leave.dto';
import { authenticate } from '../middleware/authentication';


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
    this.router.post('/', authenticate, validateDto(MarkLeaveDto), async (req, res, next) => {
      try {
        await this.leaveController.markLeave(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.delete('/:leaveId', async (req, res, next) => {
      try {
        await this.leaveController.cancelLeave(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/:employeeId', async (req, res, next) => {
      try {
        await this.leaveController.getLeavesByEmployee(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/', async (req, res, next) => {
      try {
        await this.leaveController.getAllLeaves(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/remaining/:employeeId', async (req, res, next) => {
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
