import type {LoggerOptions} from 'pino';
import pinoLogger from 'pino';

const isTest = process.env['NODE_ENV'] === 'test';

const baseOptions: LoggerOptions = {
  level: process.env['LOG_LEVEL'] ?? (isTest ? 'silent' : 'info'),
  serializers: {
    error: (err: unknown) => {
      if (err instanceof Error) {
        const {name, message, stack, cause} = err as Error & {cause?: unknown};
        // Include enumerable props on the error too (avoid spreading class instance directly)
        const ownPropNames = Object.keys(err as object);
        const plainErr: Record<string, unknown> = {};
        for (const key of ownPropNames) {
          const anyErr = err as unknown as Record<string, unknown>;
          plainErr[key] = anyErr[key];
        }
        const extras = Object.fromEntries(Object.entries(plainErr));
        return {name, message, stack, cause, ...extras};
      }
      return err;
    },
  },
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
