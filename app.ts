import express from 'express';
import dotenv from 'dotenv';
import createDatabaseConnection from './config/database';
import { EmployeeRoutes } from './routes/employee.routes';
import { departmentRoutes } from './routes/department.routes';
import { loginRouter } from './routes/login.routes';
import logger from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

createDatabaseConnection()
  .then(() => {
    logger.info('Connected to database');
  })
  .catch((error) => logger.error('TypeORM connection error: ', error));

app.use('/employees', EmployeeRoutes);
app.use('/departments', departmentRoutes);
app.use('/login', loginRouter);

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
