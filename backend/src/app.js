import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import logger from './utils/logger.js';
import apiRoutes from './routes/api.routes.js';
import authRoutes from './routes/auth.routes.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", 'https:'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  skip: () => env.NODE_ENV === 'test',
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/api', (req, res) => res.json({ name: 'LazerVault API', version: '1.0.0' }));

app.use('/api/auth', globalLimiter, authRoutes);
app.use('/api', globalLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
