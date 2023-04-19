import express from 'express';
import dotenv from 'dotenv';
import createDatabaseConnection from './config/database';
import { EmployeeRoutes } from './routes/employee.routes';
import { DepartmentRoutes } from './routes/department.routes';
import { LoginRoutes } from './routes/login.routes';
import logger from './utils/logger';
import { errorHandler } from './middleware/error-handler.middleware';

dotenv.config();

export class App {
  private app: express.Application = express();
  private port = process.env.PORT || 3000;

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.startServer();
  }

  private initializeMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    // Add CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  private initializeRoutes() {
    this.app.use('/employees', new EmployeeRoutes().getRouter());
    this.app.use('/departments', new DepartmentRoutes().getRouter());
    this.app.use('/login', new LoginRoutes().getRouter());
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  private startServer() {
    this.app.listen(this.port, () => {
      logger.info(`Server running at http://localhost:${this.port}`);
    });
  }
}
