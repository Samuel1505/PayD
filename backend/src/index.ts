import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app.js';
import logger from './utils/logger.js';
import config from './config/index.js';
import { initializeSocket } from './services/socketService.js';
import { startWorkers } from './workers/index.js';

dotenv.config();

const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start BullMQ Background Workers
startWorkers();

const PORT = config.port || process.env.PORT || 4000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Contract registry: http://localhost:${PORT}/api/contracts`);
});
