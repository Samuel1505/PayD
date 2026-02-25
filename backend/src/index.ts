import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { config } from './config/env';
import { getThrottlingConfig } from './config/env';
import { apiVersionMiddleware } from './middlewares/apiVersionMiddleware';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import v1Routes from './routes/v1';
import webhookRoutes from './routes/webhook.routes';
import { initializeSocket, emitTransactionUpdate } from './services/socketService';
import { HealthController } from './controllers/healthController';
import { ThrottlingService } from './services/throttlingService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Serve stellar.toml for SEP-0001
app.get('/.well-known/stellar.toml', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, '../.well-known/stellar.toml'));
});

app.use(apiVersionMiddleware);

// Routes
app.use('/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
