import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

export class EmployeeRoutes {
  private router = Router();
  private employeeController = new EmployeeController();

  constructor() {
    this.router.get('/', this.employeeController.getAllEmployees);
    this.router.post('/', this.employeeController.createEmployee);
    this.router.get('/:id', this.employeeController.getEmployeeById);
    this.router.put('/:id', this.employeeController.updateEmployee);
    this.router.delete('/:id', this.employeeController.deleteEmployee);
  }

  public getRouter() {
    return this.router;
  }
}
