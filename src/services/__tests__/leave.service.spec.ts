import { Repository } from 'typeorm';
import { LeaveService } from '../leave.service';
import { Leave } from '../../entities/leave.entity';
import { LeaveType } from '../../entities/leaveType.entity';
import { EmployeeService } from '../employee.service';
import { LeaveRepository } from '../../repositories/leave.repository';
import { LeaveTypeRepository } from '../../repositories/leaveType.repository';
import { EmployeeRepository } from '../../repositories/employee.repository';
import { HTTPException } from '../../middleware/error-handler.middleware';

jest.mock('../../repositories/leave.repository', () => ({
    LeaveRepository: jest.fn().mockImplementation(() => ({
        createLeave: jest.fn(),
        getLeaveById: jest.fn(),
        getLeavesByEmployee: jest.fn(),
        getAllLeaves: jest.fn(),
        getOverlappingLeavesOfEmployee: jest.fn(),
        getApprovedLeaveCountInCurrentYear: jest.fn(),
        getRemainingLeaves: jest.fn(),
    })),
}));

jest.mock('../../repositories/employee.repository', () => ({
    EmployeeRepository: jest.fn().mockImplementation(() => ({
        findAll: jest.fn(),
        findOneById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    })),
}));

jest.mock('../../repositories/leaveType.repository', () => ({
    LeaveTypeRepository: jest.fn().mockImplementation(() => ({
        save: jest.fn(),
        find: jest.fn(),
        findOneOrFail: jest.fn(),
        delete: jest.fn(),
    })),
}));

jest.mock('../employee.service', () => {
    return jest.fn().mockImplementation(() => ({
        getEmployeeById: jest.fn().mockResolvedValue({}),
        findAllEmployees: jest.fn().mockResolvedValue([]),
        createEmployee: jest.fn().mockResolvedValue({}),
        updateEmployee: jest.fn().mockResolvedValue({}),
        deleteEmployee: jest.fn().mockResolvedValue(true),
    }));
});

describe('LeaveService', () => {
    let leaveService: LeaveService;
    let leaveRepository: LeaveRepository;
    let employeeService: EmployeeService;
    let leaveTypeRepository: LeaveTypeRepository;
    let employeeRepository: EmployeeRepository;

    beforeEach(() => {
        leaveRepository = new LeaveRepository();
        employeeRepository = new EmployeeRepository();

        employeeService = new EmployeeService(employeeRepository);

        leaveTypeRepository = new LeaveTypeRepository();

        leaveService = new LeaveService(leaveRepository, employeeService, leaveTypeRepository);
    });

    describe('markLeave', () => {
        it('should throw an error if the employee does not exist', async () => {
            employeeService.getEmployeeById = jest.fn().mockResolvedValue(null);
            await expect(leaveService.markLeave(1, 1, new Date(), new Date())).rejects.toThrowError('Employee with id 1 not found');
        });

        it('should throw an error if the leave type does not exist', async () => {
            leaveTypeRepository.findOne = jest.fn().mockResolvedValue(null);
            await expect(leaveService.markLeave(1, 1, new Date(), new Date())).rejects.toThrowError('Leave type with id 1 not found');
        });

        it('should throw an error if the leave request is not within the current year', async () => {
            const pastYear = new Date().getFullYear() - 1;
            const startDate = new Date(`${pastYear}-01-01`);
            const endDate = new Date(`${pastYear}-12-31`);
            await expect(leaveService.markLeave(1, 1, startDate, endDate)).rejects.toThrowError('Leave request should be within the current year');
        });

        it('should throw an error if the leave request overlaps with existing leaves', async () => {
            leaveRepository.getOverlappingLeavesOfEmployee = jest.fn().mockResolvedValue([{}]);
            await expect(leaveService.markLeave(1, 1, new Date(), new Date())).rejects.toThrowError('Leave request overlaps with existing leaves');
        });

        it('should throw an error if the leave request exceeds the maximum allowed limit', async () => {
            const leaveType = new LeaveType();
            leaveType.maxDays = 10;
            leaveTypeRepository.findOne = jest.fn().mockResolvedValue(leaveType);

            leaveRepository.getApprovedLeaveCountInCurrentYear = jest.fn().mockResolvedValue(10);

            await expect(leaveService.markLeave(1, 1, new Date(), new Date())).rejects.toThrowError("Leave request exceeds the maximum allowed limit of 10 days for leave type 'undefined'");
        });

        it('should create and return a leave entity if all validation passes', async () => {
            const employee = new Employee();
            employee.id = 1;

            const leaveType = new LeaveType();
            leaveType.maxDays = 10;

            const leave = new Leave();
            leave.startDate = new Date();
            leave.endDate = new Date();
            leave.employee = employee;
            leave.leaveType = leaveType;
            leave.status = 'APPROVED';

            employeeService.getEmployeeById = jest.fn().mockResolvedValue(employee);
            leaveTypeRepository.findOne = jest.fn().mockResolvedValue(leaveType);
            leaveRepository.getOverlappingLeavesOfEmployee = jest.fn().mockResolvedValue([]);
            leaveRepository.getApprovedLeaveCountInCurrentYear = jest.fn().mockResolvedValue(0);
            leaveRepository.createLeave = jest.fn().mockResolvedValue(leave);

            await expect(leaveService.markLeave(1, 1, new Date(), new Date())).res

            await expect(leaveService.markLeave(1, 1, new Date(), new Date())).resolves.toBeTruthy();
            const allLeavesAfterMarking = await leaveService.getAllLeaves();
            expect(allLeavesAfterMarking).toHaveLength(1);
            expect(allLeavesAfterMarking[0].employeeId).toBe(1);
            expect(allLeavesAfterMarking[0].startDate).toBeInstanceOf(Date);
            expect(allLeavesAfterMarking[0].endDate).toBeInstanceOf(Date);
        });
    });

    describe('cancelLeave', () => {
        it('should cancel the leave with the specified ID', async () => {
            // Arrange
            const leave = new Leave();
            leave.id = 1;
            leave.status = 'APPROVED';
            jest.spyOn(leaveRepository, 'getLeaveById').mockResolvedValue(leave);
            jest.spyOn(leaveRepository, 'save').mockResolvedValue(leave);

            // Act
            await leaveService.cancelLeave(1);

            // Assert
            expect(leave.status).toBe('Cancelled');
            expect(leaveRepository.save).toHaveBeenCalledWith(leave);
        });

        it('should throw an error if the leave with the specified ID is not found', async () => {
            // Arrange
            jest.spyOn(leaveRepository, 'getLeaveById').mockResolvedValue(undefined);

            // Act and Assert
            await expect(leaveService.cancelLeave(1)).rejects.toThrow('Leave not found');
        });
    });

    describe('getLeavesByEmployee', () => {
        it('should return an array of leaves for the specified employee', async () => {
            // Arrange
            const employeeId = 1;
            const leaves = [
                new Leave(),
                new Leave(),
            ];
            jest.spyOn(leaveRepository, 'getLeavesByEmployee').mockResolvedValue(leaves);

            // Act
            const result = await leaveService.getLeavesByEmployee(employeeId);

            // Assert
            expect(result).toEqual(leaves);
        });
    });

    describe('getAllLeaves', () => {
        it('should return an array of all leaves', async () => {
            // Arrange
            const leaves = [
                new Leave(),
                new Leave(),
            ];
            jest.spyOn(leaveRepository, 'getAllLeaves').mockResolvedValue(leaves);

            // Act
            const result = await leaveService.getAllLeaves();

            // Assert
            expect(result).toEqual(leaves);
        });
    });

    // describe('configureMaxLeaves', () => {
    //     // it('should update the maximum days for the specified leave type', async () => {
    //     //     // Arrange
    //     //     const leaveType = new LeaveType();
    //     //     leaveType.id = 1;
    //     //     leaveType.name = 'Annual Leave';
    //     //     leaveType.maxDays = 20;
    //     //     const maxDays = 30;
    //     //     jest.spyOn(leaveTypeRepository, 'findOneOrFail').mockResolvedValue(leaveType);
    //     //     jest.spyOn(leaveTypeRepository, 'save').mockResolvedValue(leaveType);

    //     //     // Act
    //     //     const result = await leaveService.configureMaxLeaves(1, maxDays);

    //     //     // Assert
    //     //     expect(result.maxDays).toBe(maxDays);
    //     //     expect(leaveTypeRepository.save).toHaveBeenCalledWith(leaveType);
    //     // });

    //     // it('should throw an error if employee does not exist', async () => {
    //     //     // Arrange
    //     //     const leaveRepositoryMock = createMock<LeaveRepository>();
    //     //     const employeeServiceMock = createMock<EmployeeService>();
    //     //     const leaveTypeRepositoryMock = createMock<LeaveTypeRepository>();

    //     //     const employeeId = 1;
    //     //     const leaveTypeId = 1;
    //     //     const startDate = new Date();
    //     //     const endDate = new Date();

    //     //     const errorMessage = `Employee with id ${employeeId} not found`;
    //     //     employeeServiceMock.getEmployeeById.mockResolvedValueOnce(undefined);

    //     //     const leaveService = new LeaveService(leaveRepositoryMock, employeeServiceMock, leaveTypeRepositoryMock);

    //     //     // Act & Assert
    //     //     await expect(leaveService.markLeave(employeeId, leaveTypeId, startDate, endDate)).rejects.toThrowError(errorMessage);
    //     //     expect(employeeServiceMock.getEmployeeById).toHaveBeenCalledWith(String(employeeId));
    //     // });

    //     // it('should throw an error if leave type does not exist', async () => {
    //     //     // Arrange
    //     //     const leaveRepositoryMock = createMock<LeaveRepository>();
    //     //     const employeeServiceMock = createMock<EmployeeService>();
    //     //     const leaveTypeRepositoryMock = createMock<LeaveTypeRepository>();

    //     //     const employeeId = 1;
    //     //     const leaveTypeId = 1;
    //     //     const startDate = new Date();
    //     //     const endDate = new Date();

    //     //     const errorMessage = `Leave type with id ${leaveTypeId} not found`;
    //     //     employeeServiceMock.getEmployeeById.mockResolvedValueOnce({ id: employeeId });
    //     //     leaveTypeRepositoryMock.findOne.mockResolvedValueOnce(undefined);

    //     //     const leaveService = new LeaveService(leaveRepositoryMock, employeeServiceMock, leaveTypeRepositoryMock);

    //     //     // Act & Assert
    //     //     await expect(leaveService.markLeave(employeeId, leaveTypeId, startDate, endDate)).rejects.toThrowError(errorMessage);
    //     //     expect(employeeServiceMock.getEmployeeById).toHaveBeenCalledWith(String(employeeId));
    //     //     expect(leaveTypeRepositoryMock.findOne).toHaveBeenCalledWith(leaveTypeId);
    //     // });
    // });

});
