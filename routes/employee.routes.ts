import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

const router = Router();

// Initialize controller
const employeeController = new EmployeeController();

// Routes for getting all employees and creating a new employee
router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);

// Routes for getting, updating, and deleting a single employee
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export const EmployeeRoutes = router;
