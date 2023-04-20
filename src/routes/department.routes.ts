import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { DepartmentService } from '../services/department.service';
import { DepartmentRepository } from '../repositories/department.repository';
import { validateDto } from '../middleware/validate.dto';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { EditDepartmentDto } from '../dto/edit-department.dto';
import { authenticate } from '../middleware/authentication';

export class DepartmentRoutes {
  private router: Router = Router();
  private departmentController: DepartmentController;

  constructor() {
    this.departmentController = new DepartmentController(
      new DepartmentService(new DepartmentRepository())
    );
    this.routes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private routes(): void {
    this.router.get('/', authenticate(), (req, res) => this.departmentController.getAllDepartments(req, res));
    this.router.get('/:id', authenticate(), (req, res) => this.departmentController.getDepartmentById(req, res));
    this.router.post('/', authenticate(), validateDto(CreateDepartmentDto), (req, res) => this.departmentController.createDepartment(req, res));
    this.router.put('/:id', authenticate(), validateDto(EditDepartmentDto), (req, res) => this.departmentController.updateDepartment(req, res));
    this.router.delete('/:id', authenticate(), (req, res) => this.departmentController.deleteDepartment(req, res));
  }
}
