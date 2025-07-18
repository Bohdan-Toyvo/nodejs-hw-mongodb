import { Contact } from '../models/contact.js';

export const getAllContacts = async (page, perPage) => {
  const skip = (page - 1) * perPage;
  const contacts = await Contact.find().skip(skip).limit(perPage);
  return contacts;
};
export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};
export const updateContact = async (contactId, payload) => {
  const contact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return contact;
};
export const deleteContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
};
