import type {LoggerOptions} from 'pino';
import pinoLogger from 'pino';

const isTest = process.env['NODE_ENV'] === 'test';

const baseOptions: LoggerOptions = {
  level: process.env['LOG_LEVEL'] ?? (isTest ? 'silent' : 'info'),
};

const devTransport =
  process.env['NODE_ENV'] === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {};

export const logger = pinoLogger({...baseOptions, ...devTransport});
