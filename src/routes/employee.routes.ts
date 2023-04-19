import { Router } from 'express';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeService } from '../services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';
import { validateDto } from '../middleware/validate.dto';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EditEmployeeDto } from '../dto/edit-employee.dto';

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
    this.router.get('/', (req, res) => this.employeeController.getAllEmployees(req, res));
    this.router.post('/', validateDto(CreateEmployeeDto), (req, res) => this.employeeController.createEmployee(req, res));
    this.router.get('/:id', (req, res) => this.employeeController.getEmployeeById(req, res));
    this.router.put('/:id', validateDto(EditEmployeeDto), (req, res) => this.employeeController.updateEmployee(req, res));
    this.router.delete('/:id', (req, res) => this.employeeController.deleteEmployee(req, res));
  }

  public getRouter() {
    return this.router;
  }
}
