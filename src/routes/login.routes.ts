import express, { Router } from 'express';
import { LoginController } from '../controllers/login.controller';

export class LoginRoutes {
  private router: Router;
  private loginController: LoginController;

  constructor() {
    this.router = express.Router();
    this.loginController = new LoginController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/signup', this.loginController.signup);
    this.router.post('/signin', this.loginController.login);
  }

  public getRouter(): Router {
    return this.router;
  }
}
