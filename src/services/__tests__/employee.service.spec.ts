import { createConnection, getConnection } from 'typeorm';
import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { EditEmployeeDto } from '../../dto/edit-employee.dto';
import { Employee } from '../../entities/employee.entity';
import { HTTPException } from '../../middleware/error-handler.middleware';
import { EmployeeRepository } from '../../repositories/employee.repository';
import { EmployeeService } from '../employee.service';

jest.mock('../../repositories/employee.repository', () => ({
    EmployeeRepository: jest.fn().mockImplementation(() => ({
        findAll: jest.fn(),
        findOneById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    })),
}));

describe('EmployeeService', () => {
    let employeeService: EmployeeService;
    let employeeRepository: EmployeeRepository;

    beforeEach(() => {
        employeeRepository = new EmployeeRepository();
        employeeService = new EmployeeService(employeeRepository);
    });

    describe('getAllEmployees', () => {
        it('should return all employees', async () => {
            const employees: Employee[] = [
                { id: 1, name: 'John Doe', password: "password123", experience: 5, joiningDate: new Date('2020-01-01'), role: 'developer', status: 'active' },
                { id: 2, name: 'Jane Smith', password: "password123", experience: 10, joiningDate: new Date('2015-01-01'), role: 'manager', status: 'inactive' },
            ];

            jest.spyOn(employeeRepository, 'findAll').mockResolvedValue(employees);

            const result = await employeeService.getAllEmployees();

            expect(result).toEqual(employees);
        });
    });

    describe('getEmployeeById', () => {
        it('should return the employee with the given id', async () => {
            const employee: Employee = { id: 1, name: 'John Doe', password: "password123", experience: 5, joiningDate: new Date('2020-01-01'), role: 'developer', status: 'active' };

            jest.spyOn(employeeRepository, 'findOneById').mockResolvedValue(employee);

            const result = await employeeService.getEmployeeById('1');

            expect(result).toEqual(employee);
        });

        it('should throw a 404 error if employee is not found', async () => {
            jest.spyOn(employeeRepository, 'findOneById').mockResolvedValue(undefined);

            await expect(employeeService.getEmployeeById('1')).rejects.toThrow('Employee not found');
        });
    });

    describe('createEmployee', () => {
        it('should create and return a new employee', async () => {
            const employeeDto: CreateEmployeeDto = {
                name: 'John Doe',
                password: 'password',
                experience: 5,
                joiningDate: new Date('2020-01-01'),
                role: 'developer',
                status: 'active',
                address: {
                    addressLine1: '123 Main St',
                    addressLine2: 'Apt 4',
                    country: 'USA',
                    state: 'CA',
                    district: 'LA',
                },
            };

            const employee: Employee = { id: 1, name: 'John Doe', password: "password", experience: 5, joiningDate: new Date('2020-01-01'), role: 'developer', status: 'active' };
            jest.spyOn(employeeRepository, 'create').mockResolvedValue(employee);

            const result = await employeeService.createEmployee(employeeDto);

            expect(result).toEqual(employee);
        });
    });

    describe('updateEmployee', () => {
        it('should update and return the employee with the given id', async () => {
            const existingEmployee = {
                id: "1", name: 'John Doe', experience: 5, joiningDate: new Date('2020-01-01'), role: 'developer', status: 'active', address: {
                    "addressLine1": "dfdf",
                    "addressLine2": "dsfdds",
                    "district": "ekm",
                    "state": "kerala",
                    "country": "india"
                },
            };
            const employeeDto: EditEmployeeDto = {
                id: '1', name: 'Jane Smith', experience: 10, joiningDate: new Date('2015-01-01'), role: 'manager', status: 'inactive',
                address: {
                    "addressLine1": "dfdf",
                    "addressLine2": "dsfdds",
                    "district": "ekm",
                    "state": "kerala",
                    "country": "india"
                }
            };
            const updatedEmployee = {
                id: 1, name: 'Jane Smith', experience: 10, joiningDate: new Date('2015-01-01'), role: 'manager', status: 'inactive', address: {
                    addressLine1: '123 Main St',
                    addressLine2: 'Apt 4',
                    country: 'USA',
                    state: 'CA',
                    district: 'LA',
                },
            };

            const employeeRepositoryMock = {
                findOneById: jest.fn().mockResolvedValue(existingEmployee),
                update: jest.fn().mockResolvedValue(updatedEmployee),
            };

            const employeeService = new EmployeeService(employeeRepositoryMock as any);
            const result = await employeeService.updateEmployee('1', employeeDto);

            expect(result).toEqual(updatedEmployee);
            expect(employeeRepositoryMock.findOneById).toHaveBeenCalled();
            expect(employeeRepositoryMock.update).toHaveBeenCalledWith("1", { ...existingEmployee, ...employeeDto });
        });

        it('should throw an error when no employee is found with the given id', async () => {
            const employeeRepositoryMock = {
                findOneById: jest.fn().mockResolvedValue(undefined),
            };

            const employeeService = new EmployeeService(employeeRepositoryMock as any);

            await expect(employeeService.updateEmployee('1', {} as EditEmployeeDto)).rejects.toThrow(HTTPException);
            expect(employeeRepositoryMock.findOneById).toHaveBeenCalledWith('1');
        });
    });
});
