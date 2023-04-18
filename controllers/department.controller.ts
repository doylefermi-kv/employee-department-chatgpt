import { Request, Response } from 'express';
import { DepartmentService } from '../services/department.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { EditDepartmentDto } from '../dto/edit-department.dto';

export class DepartmentController {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  public async getAllDepartments(req: Request, res: Response): Promise<void> {
    const departments = await this.departmentService.getAllDepartments();
    res.status(200).json(departments);
  }

  public async getDepartmentById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const department = await this.departmentService.getDepartmentById(id);
    res.status(200).json(department);
  }

  public async createDepartment(req: Request, res: Response): Promise<void> {
    const createDepartmentDto: CreateDepartmentDto = req.body;
    const newDepartment = await this.departmentService.createDepartment(createDepartmentDto);
    res.status(201).json(newDepartment);
  }

  public async updateDepartment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const editDepartmentDto: EditDepartmentDto = req.body;
    const updatedDepartment = await this.departmentService.updateDepartment(id, editDepartmentDto);
    res.status(200).json(updatedDepartment);
  }

  public async deleteDepartment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.departmentService.deleteDepartment(id);
    res.status(204).send();
  }
}
