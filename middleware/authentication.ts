import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || '';

    let payload: JwtPayload | undefined;
    try {
      payload = jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }

    if (!payload) {
      throw new Error('Invalid token');
    }

    req.userId = payload.id;
    next();
  } catch (error) {
    logger.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
