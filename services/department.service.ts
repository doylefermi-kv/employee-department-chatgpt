import { Department } from '../entities/department.model';
import { DepartmentDto } from '../dto/department.dto';
import { DepartmentRepository } from '../repositories/department.repository';

export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.findAll();
  }

  async getDepartmentById(id: string): Promise<Department> {
    return this.departmentRepository.findById(id);
  }

  async createDepartment(departmentDto: DepartmentDto): Promise<Department> {
    const department = new Department();
    department.name = departmentDto.name;
    department.status = departmentDto.status;

    return this.departmentRepository.create(department);
  }

  async updateDepartment(id: string, departmentDto: DepartmentDto): Promise<Department> {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      throw new Error(`Department with id ${id} not found`);
    }

    department.name = departmentDto.name;
    department.status = departmentDto.status;

    return this.departmentRepository.update(department);
  }

  async deleteDepartment(id: string): Promise<boolean> {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      throw new Error(`Department with id ${id} not found`);
    }

    await this.departmentRepository.delete(id);
    return true;
  }
}
