import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

export class LoginController {
  private employeeService: EmployeeService;

  constructor(employeeService: EmployeeService) {
    this.employeeService = employeeService;
  }

  async signup(req: Request, res: Response) {
    const employeeDto: CreateEmployeeDto = req.body;
    const createdEmployee = await this.employeeService.createEmployee(employeeDto);
    return res.json({ data: createdEmployee });
  }


  async login(req: Request, res: Response) {
    const { name, password } = req.body;
    const credentials = await this.employeeService.login({name, password});
    if (!credentials) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ data: { token: credentials } });
  }
}
