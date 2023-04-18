import { Employee } from "../entities/employee.entity";
import { EmployeeRepository } from "../repositories/employee.repository";
import { CreateEmployeeDto } from "../dtos/create-employee.dto";
import { EditEmployeeDto } from "../dtos/edit-employee.dto";

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAll();
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOneById(id);
    if (!employee) {
      throw new Error(`Employee with id ${id} does not exist.`);
    }
    return employee;
  }

  async createEmployee(employeeDto: CreateEmployeeDto): Promise<Employee> {
    const { name, email, departmentId } = employeeDto;

    if (!name || !email || !departmentId) {
      throw new Error("Name, email, and departmentId are required.");
    }

    const existingEmployee = await this.employeeRepository.findByEmail(email);
    if (existingEmployee) {
      throw new Error("An employee with that email already exists.");
    }

    const employee = new Employee();
    employee.name = name;
    employee.email = email;
    employee.departmentId = departmentId;

    return await this.employeeRepository.create(employee);
  }

  async updateEmployee(
    id: string,
    employeeDto: EditEmployeeDto
  ): Promise<Employee> {
    const { name, email, departmentId } = employeeDto;

    const existingEmployee = await this.employeeRepository.findOneById(id);
    if (!existingEmployee) {
      throw new Error(`Employee with id ${id} does not exist.`);
    }

    if (!name && !email && !departmentId) {
      throw new Error("At least one of name, email, or departmentId is required.");
    }

    if (email) {
      const existingEmployeeWithEmail = await this.employeeRepository.findByEmail(
        email
      );
      if (existingEmployeeWithEmail && existingEmployeeWithEmail.id !== id) {
        throw new Error("An employee with that email already exists.");
      }
    }

    existingEmployee.name = name || existingEmployee.name;
    existingEmployee.email = email || existingEmployee.email;
    existingEmployee.departmentId =
      departmentId || existingEmployee.departmentId;

    return await this.employeeRepository.update(id, existingEmployee);
  }

  async deleteEmployee(id: string): Promise<void> {
    const existingEmployee = await this.employeeRepository.findOneById(id);
    if (!existingEmployee) {
      throw new Error(`Employee with id ${id} does not exist.`);
    }
    await this.employeeRepository.delete(id);
  }
}
