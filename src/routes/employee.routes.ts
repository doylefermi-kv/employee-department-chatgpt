import { Router } from 'express';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeService } from '../services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';

export class EmployeeRoutes {
  private router = Router();
  private readonly employeeController: EmployeeController

  constructor() {
    this.employeeController = new EmployeeController(
      new EmployeeService(new EmployeeRepository())
    );
    this.routes();
  }

  public async routes() {
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
