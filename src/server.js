import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from './services/contacts.js';
import { PORT } from './utils/env.js';

dotenv.config();

const logger = pino();

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();

      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      logger.error('Error fetching contacts:', error.message);
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contacts',
        error: error.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      logger.error(
        `Error fetching contact by ID (${req.params.contactId}):`,
        error.message,
      );

      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contact',
        error: error.message,
      });
    }
  });

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
