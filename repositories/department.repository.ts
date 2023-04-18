import { getRepository } from 'typeorm';
import { Department } from '../entities/department.entity';

export class DepartmentRepository {
  private repository = getRepository(Department);

  async getAllDepartments(): Promise<Department[]> {
    return this.repository.find();
  }

  async getDepartmentById(id: string): Promise<Department | undefined> {
    return this.repository.findOne(id);
  }

  async createDepartment(departmentData: Department): Promise<Department> {
    const department = this.repository.create(departmentData);
    return this.repository.save(department);
  }

  async updateDepartment(id: string, departmentData: Partial<Department>): Promise<Department | undefined> {
    const department = await this.repository.findOne(id);
    if (department) {
      Object.assign(department, departmentData);
      await this.repository.save(department);
    }
    return department;
  }

  async deleteDepartment(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
