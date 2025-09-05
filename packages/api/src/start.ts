import {createServer} from './server';
import {logger} from './utils/logger';

try {
  await createServer();
} catch (err) {
  logger.error({error: err}, 'Failed to start server');
  process.exit(1);
}
