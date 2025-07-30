import { Contact } from '../models/contact.js';

export const getAllContacts = async (
  filter,
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
) => {
  const skip = (page - 1) * perPage;
  const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

  const contacts = await Contact.find({ ...filter, userId: userId })
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrderValue });

  return contacts;
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId: userId });
  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await Contact.create({
    ...payload,
    userId: userId,
  });
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId: userId },
    payload,
    {
      new: true,
    },
  );
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return contact;
};
