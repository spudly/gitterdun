import {createServer} from './server.js';
import {logger} from './utils/logger.js';

try {
  await createServer();
} catch (err) {
  logger.error({error: err}, 'Failed to start server');
  process.exit(1);
}
