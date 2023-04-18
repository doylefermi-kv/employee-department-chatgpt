import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { EmployeeService } from '../services/employee.service.ts';

const saltRounds = 10;

export class LoginController {
  private employeeService = new EmployeeService();

  public async signUp(req: Request, res: Response) {
    const { username, password, firstName, lastName, email, phone, role } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create employee
    const createdEmployee = await this.employeeService.createEmployee({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phone,
      role
    });

    res.json({ employee: createdEmployee });
  }

  public async signIn(req: Request, res: Response) {
    const { username, password } = req.body;

    // Get employee by username
    const employee = await this.employeeService.getEmployeeByUsername(username);

    // Check if employee exists
    if (!employee) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if password is correct
    const passwordMatches = await bcrypt.compare(password, employee.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create and sign JWT token
    const token = jwt.sign({ employeeId: employee.id }, process.env.JWT_SECRET);

    res.json({ token });
  }
}
