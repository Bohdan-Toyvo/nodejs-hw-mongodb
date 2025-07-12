import { Router } from 'express'; // Імпортуємо Router з Express
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contacts.js'; // Імпортуємо наші контролери

const contactsRouter = Router(); // Створюємо новий об'єкт Router

// Реєструємо роути і прив'язуємо їх до контролерів
contactsRouter.get('/', getContactsController); // Роут для отримання всіх контактів
contactsRouter.get('/:contactId', getContactByIdController); // Роут для отримання контакту за ID

export default contactsRouter;
