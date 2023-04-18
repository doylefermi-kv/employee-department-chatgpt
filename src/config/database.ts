import { createConnection, Connection } from 'typeorm';
import logger from '../utils/logger';

const createDatabaseConnection = async (): Promise<Connection> => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
    });
    logger.info('Database connection established');
    return connection;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

export default createDatabaseConnection;

