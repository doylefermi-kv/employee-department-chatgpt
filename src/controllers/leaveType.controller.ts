import { NextFunction, Request, Response } from 'express';
import { LeaveTypeService } from '../services/leaveType.service';
import { ConfigureLeaveTypeDto } from '../dto/configure-leave-type.dto';

export class LeaveTypeController {
    private leaveTypeService: LeaveTypeService;

    constructor(leaveTypeService: LeaveTypeService) {
        this.leaveTypeService = leaveTypeService;
    }

    public getLeaveTypeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const leaveType = await this.leaveTypeService.getLeaveTypeById(Number(id));
            res.json(leaveType);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    public getAllLeaveTypes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveTypes = await this.leaveTypeService.getLeaveTypes();
            res.json(leaveTypes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    public createLeaveType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveTypeDto = req.body as ConfigureLeaveTypeDto;
            const createdLeaveType = await this.leaveTypeService.createLeaveType(leaveTypeDto.name, leaveTypeDto.maxDays);
            res.status(201).json(createdLeaveType);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    public updateLeaveType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const leaveTypeDto = req.body as ConfigureLeaveTypeDto;
            const updatedLeaveType = await this.leaveTypeService.updateLeaveType(Number(id), leaveTypeDto.name, leaveTypeDto.maxDays);
            res.json(updatedLeaveType);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    public deleteLeaveType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.leaveTypeService.deleteLeaveType(Number(id));
            res.sendStatus(204);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

}

