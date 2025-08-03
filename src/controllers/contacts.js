import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { Contact } from '../models/contact.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import fs from 'node:fs/promises';

export const getContactsController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

  const { type, isFavourite } = req.query;
  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite) {
    filter.isFavourite = isFavourite === 'true';
  }

  const userId = req.user.id;

  const contacts = await getAllContacts(
    filter,
    page,
    perPage,
    sortBy,
    sortOrder,
    userId,
  );

  const totalItems = await Contact.countDocuments({
    ...filter,
    userId: userId,
  });
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user.id;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let contact;

  const userId = req.user.id;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);

    await fs.unlink(req.file.path);

    const payload = {
      ...req.body,
      photo: result.secure_url,
    };

    contact = await createContact(payload, userId);
  } else {
    const payload = {
      ...req.body,
    };

    contact = await createContact(payload, userId);
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  let contact;

  const userId = req.user.id;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);

    await fs.unlink(req.file.path);

    const payload = {
      ...req.body,
      photo: result.secure_url,
    };

    contact = await updateContact(contactId, payload, userId);
  } else {
    const payload = {
      ...req.body,
    };

    contact = await updateContact(contactId, payload, userId);
  }

  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: `Contact with ID ${contactId} not found`,
      data: null,
    });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched contact with id ${contactId}!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user.id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
