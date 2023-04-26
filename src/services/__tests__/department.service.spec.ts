import { Department } from '../../entities/department.entity';
import { CreateDepartmentDto } from '../../dto/create-department.dto';
import { EditDepartmentDto } from '../../dto/edit-department.dto';
import { DepartmentRepository } from '../../repositories/department.repository';
import { DepartmentService } from '../department.service';

jest.mock('../../repositories/department.repository', () => ({
    DepartmentRepository: jest.fn().mockImplementation(() => ({
        getAllDepartments: jest.fn(),
        getDepartmentById: jest.fn(),
        createDepartment: jest.fn(),
        updateDepartment: jest.fn(),
        deleteDepartment: jest.fn(),
    })),
}));

describe('DepartmentService', () => {
    let service: DepartmentService;
    let repository: DepartmentRepository;

    beforeEach(() => {
        repository = new DepartmentRepository();
        service = new DepartmentService(repository);
    });

    describe('getAllDepartments', () => {
        it('should call getAllDepartments method of DepartmentRepository', async () => {
            const getAllDepartmentsSpy = jest.spyOn(repository, 'getAllDepartments');
            await service.getAllDepartments();
            expect(getAllDepartmentsSpy).toHaveBeenCalled();
        });

        it('should return an array of departments', async () => {
            const departments: Department[] = [{ id: 1, name: 'IT', status: 'active' }];
            jest.spyOn(repository, 'getAllDepartments').mockResolvedValue(departments);
            const result = await service.getAllDepartments();
            expect(result).toEqual(departments);
        });
    });

    describe('getDepartmentById', () => {
        it('should call getDepartmentById method of DepartmentRepository with correct parameter', async () => {
            const departmentId = '1';
            const department: Department = { id: Number(departmentId), name: 'IT', status: 'active' };
            const getDepartmentByIdSpy = jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(department);
            await service.getDepartmentById(departmentId);
            expect(getDepartmentByIdSpy).toHaveBeenCalledWith(departmentId);
        });

        it('should return a department when given id is valid', async () => {
            const departmentId = '1';
            const department: Department = { id: Number(departmentId), name: 'IT', status: 'active' };
            jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(department);
            const result = await service.getDepartmentById(departmentId);
            expect(result).toEqual(department);
        });

        it('should throw an error when given id is invalid', async () => {
            const departmentId = '2';
            jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(undefined);
            await expect(service.getDepartmentById(departmentId)).rejects.toThrow(`Department with id ${departmentId} not found`);
        });
    });

    describe('createDepartment', () => {
        it('should call createDepartment method of DepartmentRepository with correct parameter', async () => {
            const departmentDto: CreateDepartmentDto = { name: 'IT', status: 'active' };
            const createDepartmentSpy = jest.spyOn(repository, 'createDepartment');
            await service.createDepartment(departmentDto);
            expect(createDepartmentSpy).toHaveBeenCalledWith(expect.objectContaining(departmentDto));
        });

        it('should return a created department', async () => {
            const departmentDto: CreateDepartmentDto = { name: 'IT', status: 'active' };
            const createdDepartment: Department = { id: 1, name: 'IT', status: 'active' };
            jest.spyOn(repository, 'createDepartment').mockResolvedValue(createdDepartment);
            const result = await service.createDepartment(departmentDto);
            expect(result).toEqual(createdDepartment);
        });
    });

    describe('updateDepartment', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should call getDepartmentById method of DepartmentRepository with correct parameter', async () => {
            const departmentId = '1';
            const departmentDto: EditDepartmentDto = { name: 'IT', status: 'inactive' };
            const department: Department = { id: Number(departmentId), name: 'IT', status: 'active' };
            const getDepartmentByIdSpy = jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(department);

            await service.updateDepartment(departmentId, departmentDto);

            expect(getDepartmentByIdSpy).toHaveBeenCalledWith(departmentId);
        });

        it('should throw an error if department with given id does not exist', async () => {
            const departmentId = '1';
            const departmentDto: EditDepartmentDto = { name: 'IT', status: 'inactive' };
            jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(undefined);

            await expect(service.updateDepartment(departmentId, departmentDto)).rejects.toThrowError(
                `Department with id ${departmentId} not found`,
            );
        });

        it('should update department with given id and return updated department', async () => {
            const departmentId = '1';
            const departmentDto: EditDepartmentDto = { name: 'IT', status: 'inactive' };
            const department = new Department();
            department.id = Number(departmentId);
            department.name = 'Marketing';
            department.status = 'active';

            const updatedDepartment = new Department();
            department.id = Number(departmentId);
            department.name = departmentDto.name;
            department.status = departmentDto.status;

            jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(department);
            const updateDepartmentSpy = jest.spyOn(repository, 'updateDepartment').mockResolvedValue(updatedDepartment);

            const result = await service.updateDepartment(departmentId, departmentDto);

            expect(updateDepartmentSpy).toHaveBeenCalledWith(departmentId, department);
            expect(result).toEqual(updatedDepartment);
        });
    });

    describe('deleteDepartment', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should call getDepartmentById method of DepartmentRepository with correct parameter', async () => {
            const departmentId = '1';
            const department = new Department();
            department.id = Number(departmentId);
            department.name = 'Marketing';
            department.status = 'active';
            const getDepartmentByIdSpy = jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(department);

            await service.deleteDepartment(departmentId);

            expect(getDepartmentByIdSpy).toHaveBeenCalledWith(departmentId);
        });

        it('should throw an error if department with given id does not exist', async () => {
            const departmentId = '1';
            jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(undefined);

            await expect(service.deleteDepartment(departmentId)).rejects.toThrowError(
                `Department with id ${departmentId} not found`,
            );
        });

        it('should call deleteDepartment method of DepartmentRepository with correct parameter and return true', async () => {
            const departmentId = '1';
            const department = new Department();
            department.id = Number(departmentId);
            department.name = 'Marketing';
            department.status = 'active';
            jest.spyOn(repository, 'getDepartmentById').mockResolvedValue(department);
            const deleteDepartmentSpy = jest.spyOn(repository, 'deleteDepartment').mockResolvedValue(true);

            const result = await service.deleteDepartment(departmentId);

            expect(result).toEqual(true);
            expect(deleteDepartmentSpy).toHaveBeenCalledWith(departmentId);
        });
    });
});
