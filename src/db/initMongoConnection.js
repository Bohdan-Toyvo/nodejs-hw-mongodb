import mongoose from 'mongoose';
import {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_URL,
  MONGODB_DB,
} from '../utils/env.js';
import pino from 'pino';

const logger = pino();

export const initMongoConnection = async () => {
  try {
    const mongoUrl = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoUrl);

    logger.info('Mongo connection successfully established!');
    console.log('Mongo connection successfully established!');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
