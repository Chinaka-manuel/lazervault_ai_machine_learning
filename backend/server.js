import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import env from './src/config/env.js';

const PORT = env.PORT;

const start = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info(`LazerVault server running on port ${PORT} [${env.NODE_ENV}]`);
    });

    const shutdown = (signal) => {
      logger.warn(`Received ${signal}, shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

start();
