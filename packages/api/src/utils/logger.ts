import type {LoggerOptions} from 'pino';
import pinoLogger from 'pino';

const baseOptions: LoggerOptions = {level: process.env['LOG_LEVEL'] ?? 'info'};

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
