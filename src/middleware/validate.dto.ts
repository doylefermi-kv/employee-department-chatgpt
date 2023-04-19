import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';

export function validateDto<T extends object>(dtoClass: new () => T): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = new dtoClass();
    Object.assign(dto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors: errors });
    } else {
      // Set the validated DTO on the request object
      req.body = dto;
      next();
    }
  };
}
