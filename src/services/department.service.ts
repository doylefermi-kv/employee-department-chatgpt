import { Department } from '../entities/department.entity';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { EditDepartmentDto } from '../dto/edit-department.dto';
import { DepartmentRepository } from '../repositories/department.repository';

export class DepartmentService {
  private readonly departmentRepository: DepartmentRepository;
  constructor(departmentRepository: DepartmentRepository) {
    this.departmentRepository = departmentRepository;
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.getAllDepartments();
  }

  async getDepartmentById(id: string): Promise<Department> {
    const department = await this.departmentRepository.getDepartmentById(id);
    if (!department) {
      throw new Error(`Department with id ${id} not found`);
    }
    return department
  }

  async createDepartment(departmentDto: CreateDepartmentDto): Promise<Department> {
    const department = new Department();
    department.name = departmentDto.name;
    department.status = departmentDto.status;

    return this.departmentRepository.createDepartment(department);
  }

  async updateDepartment(id: string, departmentDto: EditDepartmentDto): Promise<Department | undefined> {
    const department = await this.departmentRepository.getDepartmentById(id);
    if (!department) {
      throw new Error(`Department with id ${id} not found`);
    }

    department.name = departmentDto.name;
    department.status = departmentDto.status;

    return this.departmentRepository.updateDepartment(id, department);
  }

  async deleteDepartment(id: string): Promise<boolean> {
    const department = await this.departmentRepository.getDepartmentById(id);
    if (!department) {
      throw new Error(`Department with id ${id} not found`);
    }

    await this.departmentRepository.deleteDepartment(id);
    return true;
  }
}
