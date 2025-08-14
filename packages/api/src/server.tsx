import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import {initializeDatabase} from './lib/initDb';
import {logger} from './utils/logger';

// Import routes
import authRoutes from './routes/auth';
import choreRoutes from './routes/chores';
import goalRoutes from './routes/goals';
import leaderboardRoutes from './routes/leaderboard';
import familyRoutes from './routes/families';
import invitationRoutes from './routes/invitations';

// Load environment variables
dotenv.config();

const appRootDir = path.resolve();
const isProduction = process.env['NODE_ENV'] === 'production';
const PORT = process.env['PORT'] || 3000;

async function createServer() {
  try {
    logger.info('Starting server initialization...');

    const app = express();

    // Initialize database
    logger.info('Initializing database...');
    await initializeDatabase();
    logger.info('Database initialization complete');

    // Middleware
    logger.info('Setting up middleware...');
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

    app.use(compression());
    if (!isProduction) {
      app.use(cors({origin: [/^http:\/\/localhost:\d+$/], credentials: true}));
    }
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: true, limit: '10mb'}));

    if (isProduction) {
      // Production: Serve built files
      app.use(express.static(path.join(appRootDir, 'dist/client')));
    }

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/chores', choreRoutes);
    app.use('/api/goals', goalRoutes);
    app.use('/api/leaderboard', leaderboardRoutes);
    app.use('/api/families', familyRoutes);
    app.use('/api/invitations', invitationRoutes);

    // Health check endpoint
    app.get('/api/health', (_req: express.Request, res: express.Response) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // Error handling middleware
    app.use(
      (
        err: any,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        logger.error({error: err}, 'Error');

        if ((err as any).type === 'entity.parse.failed') {
          return res
            .status(400)
            .json({success: false, error: 'Invalid JSON payload'});
        }

        return res
          .status((err as any).status || 500)
          .json({
            success: false,
            error:
              process.env['NODE_ENV'] === 'production'
                ? 'Internal server error'
                : (err as any).message,
          });
      },
    );

    // 404 handler for API routes
    app.use('/api/*', (_req: express.Request, res: express.Response) => {
      res.status(404).json({success: false, error: 'API endpoint not found'});
    });

    // Start server
    app.listen(Number(PORT), () => {
      logger.info(`🚀 Gitterdun server running on port ${PORT}`);
      logger.info(`📱 Frontend: http://localhost:${PORT}`);
      logger.info(`🔌 API: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health: http://localhost:${PORT}/api/health`);
    });

    logger.info('Server setup complete');
  } catch (error) {
    logger.error({error}, 'Error during server setup');
    throw error;
  }
}

createServer().catch(err => {
  logger.error({error: err}, 'Failed to start server');
  process.exit(1);
});
