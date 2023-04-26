import { Router, Request, Response } from 'express';

export class HealthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getHealth);
  }

  private getHealth(req: Request, res: Response): void {
    res.status(200).send('Server is up!');
  }

  public getRouter(): Router {
    return this.router;
  }
}
