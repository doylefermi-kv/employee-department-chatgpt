import { Request, Response } from 'express';
import { LeaveService } from '../services/leave.service';
import { MarkLeaveDto } from '../dto/markLeave.dto';
import { ConfigureLeaveTypeDto } from '../dto/configureLeaveType.dto';

const leaveService = new LeaveService();

export const markLeave = async (req: Request, res: Response) => {
  try {
    const { employeeId, leaveTypeId, startDate, endDate } = req.body as MarkLeaveDto;
    const leave = await leaveService.markLeave(employeeId, leaveTypeId, startDate, endDate);
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelLeave = async (req: Request, res: Response) => {
  try {
    const { leaveId } = req.params;
    await leaveService.cancelLeave(Number(leaveId));
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLeavesByEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const leaves = await leaveService.getLeavesByEmployee(Number(employeeId));
    res.json(leaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await leaveService.getAllLeaves();
    res.json(leaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const configureMaxLeaves = async (req: Request, res: Response) => {
  try {
    const { leaveTypeId, maxDays } = req.body as ConfigureLeaveTypeDto;
    const leaveType = await leaveService.configureMaxLeaves(leaveTypeId, maxDays);
    res.json(leaveType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRemainingLeaves = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const remainingLeaves = await leaveService.getRemainingLeaves(Number(employeeId));
    res.json(remainingLeaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
