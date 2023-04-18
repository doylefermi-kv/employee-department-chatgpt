import express from 'express';
import dotenv from 'dotenv';
import createDatabaseConnection from './config/database';
import { EmployeeRoutes } from './routes/employee.routes';
import { DepartmentRoutes } from './routes/department.routes';
import { LoginRoutes } from './routes/login.routes';
import logger from './utils/logger';

dotenv.config();

export class App {
  private app: express.Application = express();
  private port = process.env.PORT || 3000;

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.startServer();
  }

  private initializeMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.use('/employees', new EmployeeRoutes().getRouter());
    this.app.use('/departments', new DepartmentRoutes().getRouter());
    this.app.use('/login', new LoginRoutes().getRouter());
  }

  private startServer() {
    this.app.listen(this.port, () => {
      logger.info(`Server running at http://localhost:${this.port}`);
    });
  }
}