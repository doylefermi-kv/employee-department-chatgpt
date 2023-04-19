import { NextFunction, Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EditEmployeeDto } from '../dto/edit-employee.dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor(employeeService: EmployeeService) {
    this.employeeService = employeeService;
  }

  async getAllEmployees(req: Request, res: Response) {
    const employees = await this.employeeService.getAllEmployees();
    return res.status(200).json({ data: employees });
  }

  async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
      const employee = await this.employeeService.getEmployeeById(id);
      return res.status(200).json({ data: employee });
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await this.employeeService.createEmployee(req.body);
      return res.status(201).json({ data: employee });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const dto = plainToClass(EditEmployeeDto, { id, ...req.body });

    try {
      const employee = await this.employeeService.updateEmployee(id, dto);
      return res.status(200).json({ data: employee });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
      const employee = await this.employeeService.deleteEmployee(id);
      return res.status(204).json({ data: employee });
    } catch (error) {
      next(error);
    }
  }
}
