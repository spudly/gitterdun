import type {LoggerOptions} from 'pino';
import pinoLogger from 'pino';

const isTest = process.env['NODE_ENV'] === 'test';
const isProd = process.env['NODE_ENV'] === 'production';
const isUnitTest = isTest && process.env['TEST_ENV'] === 'jest';

const baseOptions: LoggerOptions = {
  level: process.env['LOG_LEVEL'] ?? (isUnitTest ? 'silent' : 'info'),
  serializers: {
    error: (err: unknown) => {
      if (err instanceof Error) {
        const {name, message, stack, cause} = err as Error & {cause?: unknown};
        return {name, message, stack, cause};
      }
      return err;
    },
  },
};

const devTransport = !isProd
  ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    }
  : {};

export const logger = pinoLogger({...baseOptions, ...devTransport});

logger.info(`NODE_ENV: ${process.env['NODE_ENV']}`);
