import express from 'express';
import dotenv from 'dotenv';
import { EmployeeRoutes } from './routes/employee.routes';
import { DepartmentRoutes } from './routes/department.routes';
import { LoginRoutes } from './routes/login.routes';
import logger from './utils/logger';
import { errorHandler } from './middleware/error-handler.middleware';
import cors from 'cors';
import { LeaveTypeRoutes } from './routes/leaveType.routes';
import { LeaveRoutes } from './routes/leave.routes';

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

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [`http://localhost:${this.port}`];

    // Add CORS middleware
    this.app.use(cors(
      {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      }
    ));
  }

  private initializeRoutes() {
    this.app.use('/employees', new EmployeeRoutes().getRouter());
    this.app.use('/departments', new DepartmentRoutes().getRouter());
    this.app.use('/login', new LoginRoutes().getRouter());
    this.app.use('/leave-type', new LeaveTypeRoutes().getRouter());
    this.app.use('/leave', new LeaveRoutes().getRouter());
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
