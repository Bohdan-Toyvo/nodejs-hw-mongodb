import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { PORT } from './utils/env.js';

dotenv.config();

const logger = pino();

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
  });

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
    logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });
};
