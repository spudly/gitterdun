import express from 'express';
import type {TypedResponse, RequestDefault} from './types/http.js';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import dotenv from 'dotenv';
import {initializeDatabase} from './lib/initDb.js';
import {logger} from './utils/logger.js';
import {DEFAULT_PORT} from './constants.js';
import {setupErrorHandling} from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import choreRoutes from './routes/chores.js';
import goalRoutes from './routes/goals.js';
import leaderboardRoutes from './routes/leaderboard.js';
import familyRoutes from './routes/families.js';
import usersRoutes from './routes/users.js';
import invitationRoutes from './routes/invitations.js';
import choreInstanceRoutes from './routes/choreInstances.js';

Error.stackTraceLimit = 100;

dotenv.config();

const appRootDir = path.resolve();
const isProduction = process.env['NODE_ENV'] === 'production';
const PORT = process.env['PORT'] ?? DEFAULT_PORT;

const initializeApp = async (): Promise<express.Express> => {
  logger.info('Starting server initialization...');
  const app = express();

  logger.info('Initializing database...');
  await initializeDatabase();
  logger.info('Database initialization complete');

  return app;
};

const setupSecurityMiddleware = (app: express.Express): void => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );
};

const setupBasicMiddleware = (app: express.Express): void => {
  if (!isProduction) {
    const corsOptions: cors.CorsOptions = {
      origin: [/^http:\/\/localhost:\d+$/],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
      ],
      optionsSuccessStatus: 204,
    };
    app.use(cors(corsOptions));
    // Explicitly handle preflight for any /api/* route using a RegExp (Express 5 friendly)
    app.options(/^\/api\/.*$/, cors(corsOptions));
  }
  app.use(express.json({limit: '10mb'}));
  app.use(express.urlencoded({extended: true, limit: '10mb'}));
};

const setupStaticServing = (app: express.Express): void => {
  if (isProduction) {
    const staticDir = path.join(appRootDir, '..', 'web', 'dist');
    app.use(express.static(staticDir));
  }
};

const setupSpaFallback = (app: express.Express): void => {
  if (isProduction) {
    const staticDir = path.join(appRootDir, '..', 'web', 'dist');
    const indexHtmlPath = path.join(staticDir, 'index.html');
    app.get(
      '*path',
      (req: RequestDefault, res: TypedResponse, next: express.NextFunction) => {
        if (req.path.startsWith('/api')) {
          next();
          return;
        }
        res.sendFile(indexHtmlPath);
      },
    );
  }
};

const setupRoutes = (app: express.Express): void => {
  app.use('/api/auth', authRoutes);
  app.use('/api/chores', choreRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/families', familyRoutes);
  app.use('/api/invitations', invitationRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/chore-instances', choreInstanceRoutes);

  app.get('/api/health', (_req: RequestDefault, res: TypedResponse) => {
    res.json({
      success: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  });
};

const startServer = (app: express.Express): void => {
  app.listen(Number(PORT), () => {
    logger.info(`🚀 Gitterdun server running on port ${PORT}`);
    logger.info(`📱 Frontend: http://localhost:8001`);
    logger.info(`🔌 API: http://localhost:${PORT}/api`);
    logger.info(`🏥 Health: http://localhost:${PORT}/api/health`);
  });
};

const setupAllMiddleware = (app: express.Express): void => {
  logger.info('Setting up middleware...');
  setupSecurityMiddleware(app);
  setupBasicMiddleware(app);
  setupStaticServing(app);
  setupRoutes(app);
  setupSpaFallback(app);
  setupErrorHandling(app);
};

export const createServer = async (): Promise<void> => {
  try {
    const app = await initializeApp();
    setupAllMiddleware(app);
    startServer(app);
    logger.info('Server setup complete');
  } catch (error) {
    logger.error({error}, 'Error during server setup');
    throw error;
  }
};

export * from './constants.js';
