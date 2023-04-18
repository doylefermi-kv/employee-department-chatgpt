import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

const saltRounds = 10;

export class LoginController {
  private employeeService = new EmployeeService();

  async signup(req: Request, res: Response) {
    const employeeDto: CreateEmployeeDto = req.body;
    const createdEmployee = await this.employeeService.createEmployee(employeeDto);
    return res.json(createdEmployee);
  }


  async login(req: Request, res: Response) {
    const { name, password } = req.body;
    const token = await this.employeeService.login({name, password});
    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ token });
  }
}
