import winston, { Logger as WinstonLogger } from 'winston';

class Logger {
  private static instance: WinstonLogger;

  private constructor() {
    const options: winston.LoggerOptions = {
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
        }),
        new winston.transports.File({
          filename: 'debug.log',
          level: 'debug',
        }),
      ],
    };

    this.init(options);
  }

  public static getInstance(): WinstonLogger {
    if (!Logger.instance) {
      Logger.instance = winston.createLogger({
        transports: [
          new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
          }),
          new winston.transports.File({
            filename: 'debug.log',
            level: 'debug',
          }),
        ],
      });
    }

    return Logger.instance;
  }

  private init(options: winston.LoggerOptions): void {
    Logger.instance = winston.createLogger(options);
  }
}

const loggerInstance = Logger.getInstance();
export default loggerInstance;
