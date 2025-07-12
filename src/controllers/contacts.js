import { getAllContacts, getContactById } from '../services/contacts.js';
import pino from 'pino';

const logger = pino();

export const getContactsController = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    logger.error('Error fetching all contacts:', error.message);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch contacts',
      error: error.message,
    });
  }
};

export const getContactByIdController = async (req, res) => {
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
};
