import { Connection, createConnection, getRepository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from './employee.repository';

let connection: Connection;
let employeeRepository: EmployeeRepository;

beforeAll(async () => {
    connection = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'test',
        entities: [Employee],
        synchronize: true,
        logging: false,
    });
    employeeRepository = new EmployeeRepository();
    employeeRepository.setConnection(connection);
});

afterAll(async () => {
    await connection.close();
});

describe('EmployeeRepository', () => {
    let employee: Employee;

    beforeEach(async () => {
        employee = await employeeRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            departmentId: '2a0165d5-1d0f-49ef-b7cb-33475c2e7ca3',
            status: 'Active',
        });
    });

    afterEach(async () => {
        await employeeRepository.delete(employee.id);
    });

    describe('findAll', () => {
        it('should return all employees', async () => {
            const employees = await employeeRepository.findAll();
            expect(employees).toHaveLength(1);
            expect(employees[0].name).toBe('John Doe');
            expect(employees[0].email).toBe('johndoe@example.com');
            expect(employees[0].departmentId).toBe('2a0165d5-1d0f-49ef-b7cb-33475c2e7ca3');
            expect(employees[0].status).toBe('Active');
        });
    });

    describe('findOneById', () => {
        it('should return an employee by id', async () => {
            const foundEmployee = await employeeRepository.findOneById(employee.id);
            expect(foundEmployee).toBeDefined();
            expect(foundEmployee?.name).toBe('John Doe');
            expect(foundEmployee?.email).toBe('johndoe@example.com');
            expect(foundEmployee?.departmentId).toBe('2a0165d5-1d0f-49ef-b7cb-33475c2e7ca3');
            expect(foundEmployee?.status).toBe('Active');
        });

        it('should return undefined if employee not found', async () => {
            const foundEmployee = await employeeRepository.findOneById('1234');
            expect(foundEmployee).toBeUndefined();
        });
    });

    describe('create', () => {
        it('should create a new employee', async () => {
            const newEmployee = {
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                departmentId: '2a0165d5-1d0f-49ef-b7cb-33475c2e7ca3',
                status: 'Active',
            };
            const createdEmployee = await employeeRepository.create(newEmployee);
            expect(createdEmployee).toBeDefined();
            expect(createdEmployee.id).toBeDefined();
            expect(createdEmployee.name).toBe('Jane Doe');
            expect(createdEmployee.email).toBe('janedoe@example.com');
            expect(createdEmployee.departmentId).toBe('2a0165d5-1d0f-49ef-b7cb-33475c2e7ca3');
            expect(createdEmployee.status).toBe('Active');
            await employeeRepository.delete(createdEmployee.id);
        });
    });

    describe('update', () => {
        it('should update an existing employee', async () => {
            const existingEmployee = await employeeRepository.create({
                name: 'John Doe',
                departmentId: 'department-id',
                email: 'johndoe@test.com',
                phone: '1234567890',
                status: 'Active'
            });

            const updatedEmployee = {
                name: 'Jane Doe',
                departmentId: 'new-department-id',
                email: 'janedoe@test.com',
                phone: '0987654321',
                status: 'Inactive'
            };

            const result = await employeeRepository.update(existingEmployee.id, updatedEmployee);

            expect(result).toEqual(expect.objectContaining(updatedEmployee));
        });

        it('should throw an error if employee does not exist', async () => {
            const updatedEmployee = {
                name: 'Jane Doe',
                departmentId: 'new-department-id',
                email: 'janedoe@test.com',
                phone: '0987654321',
                status: 'Inactive'
            };

            await expect(employeeRepository.update('non-existent-id', updatedEmployee)).rejects.toThrowError(
                'Employee with id non-existent-id does not exist.'
            );
        });

    });

    describe('delete', () => {
        it('should delete an existing employee', async () => {
            const existingEmployee = await employeeRepository.create({
                name: 'John Doe',
                departmentId: 'department-id',
                email: 'johndoe@test.com',
                phone: '1234567890',
                status: 'Active'
            });

            await employeeRepository.delete(existingEmployee.id);

            const deletedEmployee = await employeeRepository.findOneById(existingEmployee.id);
            expect(deletedEmployee).toBeUndefined();
        });

        it('should throw an error if employee does not exist', async () => {
            await expect(employeeRepository.delete('non-existent-id')).rejects.toThrowError(
                'Employee with id non-existent-id does not exist.'
            );
        });

    });
});