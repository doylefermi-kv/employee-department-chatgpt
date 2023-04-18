import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { DepartmentService } from '../services/department.service';
import { DepartmentRepository } from '../repositories/department.repository';

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
    this.router.get('/', this.departmentController.getAllDepartments);
    this.router.get('/:id', this.departmentController.getDepartmentById);
    this.router.post('/', this.departmentController.createDepartment);
    this.router.put('/:id', this.departmentController.updateDepartment);
    this.router.delete('/:id', this.departmentController.deleteDepartment);
  }
}
