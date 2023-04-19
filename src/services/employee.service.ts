import { Employee } from "../entities/employee.entity";
import { EmployeeRepository } from "../repositories/employee.repository";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { EditEmployeeDto } from "../dto/edit-employee.dto";
import { Address } from "../entities/address.entity";
import { Department } from "../entities/department.entity";
import { compare, hash } from "bcrypt";
import { LoginDto } from "../dto/login.dto";
import { sign } from 'jsonwebtoken';
import { HTTPException } from "../middleware/error-handler.middleware";


export class EmployeeService {
  private readonly employeeRepository: EmployeeRepository;

  constructor(employeeRepository: EmployeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAll();
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOneById(id);
    if (!employee) {
      throw new HTTPException(404, 'Employee not found');
    }
    return employee;
  }

  async createEmployee(employeeDto: CreateEmployeeDto): Promise<Employee> {
    const { name, password, experience, joiningDate, role, status, address, departments } = employeeDto;

    const hashedPassword = await hash(password, 10);
  
    const employee = new Employee();
    employee.name = name;
    employee.password = hashedPassword;
    employee.experience = experience;
    employee.joiningDate = joiningDate;
    employee.role = role;
    employee.status = status;
    
    const employeeAddress = new Address();
    employeeAddress.addressLine1 = address.addressLine1;
    employeeAddress.addressLine2 = address.addressLine2;
    employeeAddress.country = address.country;
    employeeAddress.district = address.district;
    employeeAddress.state = address.state;
    employee.address = employeeAddress;
  
    employee.departments = departments?.map((dept) => {
      const department = new Department();
      department.id = dept.id;
      department.name = dept.name;
      return department;
    });
  
    return await this.employeeRepository.create(employee);
  }
  

  async updateEmployee(id: string, employeeDto: EditEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepository.findOneById(id);
  
    if (!existingEmployee) {
      throw new HTTPException(404, 'Employee not found');
    }
  
    const { name, experience, joiningDate, departments, role, status, address } = employeeDto;
  
    existingEmployee.name = name || existingEmployee.name;
    existingEmployee.experience = experience || existingEmployee.experience;
    existingEmployee.joiningDate = joiningDate || existingEmployee.joiningDate;
    existingEmployee.departments = departments || existingEmployee.departments;
    existingEmployee.role = role || existingEmployee.role;
    existingEmployee.status = status || existingEmployee.status;
    // TODO: existingEmployee.address = address || existingEmployee.address;
  
    return await this.employeeRepository.update(id, existingEmployee);
  }
  

  async deleteEmployee(id: string): Promise<void> {
    const existingEmployee = await this.employeeRepository.findOneById(id);
    if (!existingEmployee) {
      throw new HTTPException(404, 'Employee not found');
    }
    await this.employeeRepository.delete(id);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { name, password } = loginDto;
    const employee = await this.employeeRepository.findByName(name);

    if (!employee) {
      throw new HTTPException(401, 'Invalid user');
    }

    const isPasswordValid = await compare(password, employee.password);

    if (!isPasswordValid) {
      throw new HTTPException(401, 'Invalid password');
    }

    const accessTokenExpirationTime = process.env.JWT_ACCESS_EXPIRATION_MINUTES || '30';
    const refreshTokenExpirationTime = process.env.JWT_REFRESH_EXPIRATION_DAYS || '30';

    const accessToken = sign({ id: employee.id }, process.env.JWT_SECRET || '', {
      expiresIn: `${accessTokenExpirationTime}m`,
    });

    const refreshToken = sign({ id: employee.id }, process.env.JWT_SECRET || '', {
      expiresIn: `${refreshTokenExpirationTime}d`,
    });

    return { accessToken, refreshToken };
  }
}
