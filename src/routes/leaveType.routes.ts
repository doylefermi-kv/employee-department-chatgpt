import { Router } from 'express';
import { LeaveTypeRepository } from '../repositories/leaveType.repository';
import { LeaveTypeService } from '../services/leaveType.service';
import { LeaveTypeController } from '../controllers/leaveType.controller';
import { validateDto } from '../middleware/validate.dto';
import { ConfigureLeaveTypeDto } from '../dto/configure-leave-type.dto';
import { authenticate } from '../middleware/authentication';

export class LeaveTypeRoutes {
  private router = Router();
  private readonly leaveTypeController: LeaveTypeController;

  constructor() {
    this.leaveTypeController = new LeaveTypeController(
      new LeaveTypeService(new LeaveTypeRepository())
    );
    this.routes();
  }

  public async routes() {
    this.router.get('/', authenticate, (req, res, next) => {
      try {
        this.leaveTypeController.getAllLeaveTypes(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/:id', authenticate, (req, res, next) => {
      try {
        this.leaveTypeController.getLeaveTypeById(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.post('/', authenticate, validateDto(ConfigureLeaveTypeDto), (req, res, next) => {
      try {
        this.leaveTypeController.createLeaveType(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.put('/:id', authenticate, validateDto(ConfigureLeaveTypeDto), (req, res, next) => {
      try {
        this.leaveTypeController.updateLeaveType(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.delete('/:id', authenticate, (req, res, next) => {
      try {
        this.leaveTypeController.deleteLeaveType(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  }

  public getRouter() {
    return this.router;
  }
}
