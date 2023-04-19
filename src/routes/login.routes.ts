import { Router } from 'express';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeService } from '../services/employee.service';
import { LoginController } from '../controllers/login.controller';

export class LoginRoutes {
  private router: Router;
  private readonly loginController: LoginController;

  constructor() {
    this.loginController = new LoginController(
      new EmployeeService(new EmployeeRepository())
    );
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/signin', (req,res) => this.loginController.login(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
