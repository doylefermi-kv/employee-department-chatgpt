import { getRepository, Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

export class EmployeeRepository {
  private repository: Repository<Employee>;

  constructor() {
    this.repository = getRepository(Employee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.repository.find({ relations: ['department'] });
  }

  async findOneById(id: string): Promise<Employee> {
    if (!id) {
      throw new Error('Employee id is required');
    }
    const employee = await this.repository.findOne(id, {
      relations: ['department'],
    });
    if (!employee) {
      throw new Error(`Employee with id ${id} does not exist`);
    }
    return employee;
  }

  async create(employee: Employee): Promise<Employee> {
    if (!employee) {
      throw new Error('Employee object is required');
    }
    return await this.repository.save(employee);
  }

  async update(id: string, employee: Employee): Promise<Employee> {
    if (!id) {
      throw new Error('Employee id is required');
    }
    if (!employee) {
      throw new Error('Employee object is required');
    }
    const existingEmployee = await this.findOneById(id);
    const updatedEmployee = { ...existingEmployee, ...employee };
    return await this.repository.save(updatedEmployee);
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('Employee id is required');
    }
    const existingEmployee = await this.findOneById(id);
    await this.repository.remove(existingEmployee);
  }

  async findByName(name: string): Promise<Employee | undefined> {
    const employees = await this.repository.findOne({
      where: {
        name,
      },
    });
    return employees;
  }
}
