import express from 'express';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { EmployeeRoutes } from './routes/employee.routes';
import { departmentRoutes } from './routes/department.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

createConnection()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => console.log('TypeORM connection error: ', error));

app.use('/employees', EmployeeRoutes);
app.use('/departments', departmentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
