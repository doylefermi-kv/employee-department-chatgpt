import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EditEmployeeDto } from '../dtos/edit-employee.dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  async getAllEmployees(req: Request, res: Response) {
    const employees = await this.employeeService.getAllEmployees();
    return res.status(200).json({ data: employees });
  }

  async getEmployeeById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const employee = await this.employeeService.getEmployeeById(id);
    if (employee) {
      return res.status(200).json({ data: employee });
    } else {
      return res.status(404).json({ message: 'Employee not found' });
    }
  }

  async createEmployee(req: Request, res: Response) {
    const dto = plainToClass(CreateEmployeeDto, req.body);
    try {
      await validateOrReject(dto);
    } catch (errors) {
      return res.status(400).json({ errors: errors });
    }

    const employee = await this.employeeService.createEmployee(dto);
    return res.status(201).json({ data: employee });
  }

  async updateEmployee(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const dto = plainToClass(EditEmployeeDto, { id, ...req.body });
    try {
      await validateOrReject(dto);
    } catch (errors) {
      return res.status(400).json({ errors: errors });
    }

    const employee = await this.employeeService.updateEmployee(id, dto);
    if (employee) {
      return res.status(200).json({ data: employee });
    } else {
      return res.status(404).json({ message: 'Employee not found' });
    }
  }

  async deleteEmployee(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const employee = await this.employeeService.deleteEmployee(id);
    if (employee) {
      return res.status(200).json({ data: employee });
    } else {
      return res.status(404).json({ message: 'Employee not found' });
    }
  }
}
