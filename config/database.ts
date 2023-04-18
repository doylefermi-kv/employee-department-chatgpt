import { createConnection, Connection } from 'typeorm';

const createDatabaseConnection = async (): Promise<Connection> => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    });
    console.log('Database connection established');
    return connection;
  } catch (error) {
    console.log('Database connection error:', error);
    throw error;
  }
};

export default createDatabaseConnection;
