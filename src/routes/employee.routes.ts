import { Router } from 'express';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeService } from '../services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';
import { validateDto } from '../middleware/validate.dto';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EditEmployeeDto } from '../dto/edit-employee.dto';
import { authenticate } from '../middleware/authentication';

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
    this.router.get('/', authenticate, (req, res) => this.employeeController.getAllEmployees(req, res));
    this.router.post('/', authenticate, validateDto(CreateEmployeeDto), (req, res, next) => {
      try {
        this.employeeController.createEmployee(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/:id', authenticate, (req, res, next) => {
      try {
        this.employeeController.getEmployeeById(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.put('/:id', authenticate, validateDto(EditEmployeeDto), (req, res, next) => {
      try {
        this.employeeController.updateEmployee(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.delete('/:id', authenticate, (req, res, next) => {
      try {
        this.employeeController.deleteEmployee(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  }

  public getRouter() {
    return this.router;
  }
}
