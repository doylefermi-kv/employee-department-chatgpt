import dotenv from 'dotenv';
import logger from './utils/logger';
import createDatabaseConnection from './config/database';
import { App } from './app';

dotenv.config();

const port = process.env.PORT;

(async () => {
  try {
    const connection = await createDatabaseConnection();
    logger.info('Connected to database');
    const app = new App();
  } catch (error) {
    logger.error('TypeORM connection error:', error);
  }
})();
