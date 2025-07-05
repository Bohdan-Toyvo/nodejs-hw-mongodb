import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';

// Завантажуємо змінні оточення з файлу .env
// Це повинно бути викликано якомога раніше в вашій програмі.
dotenv.config();

// Налаштування логера Pino
const logger = pino({
  transport: {
    target: 'pino-pretty', // Використовуємо pino-pretty для красивого виводу логів
    options: {
      colorize: true, // Додати кольори для кращого читання
    },
  },
});

/**
 * Функція для налаштування та запуску Express-сервера.
 */
export const setupServer = () => {
  const app = express(); // Створення серверу Express

  // Налаштування CORS
  app.use(cors());

  // Налаштування логера Pino для кожного запиту
  app.use((req, res, next) => {
    logger.info(
      {
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
      },
      `Incoming request: ${req.method} ${req.url}`,
    );
    next();
  });

  // Приклад базового роута (можете змінити або видалити пізніше)
  app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
  });

  // Обробка неіснуючих роутів (404 Not Found)
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
    logger.warn({ url: req.url, method: req.method }, 'Route not found');
  });

  // Запуск серверу на вказаному порті
  // process.env.PORT візьме значення з файлу .env
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`); // Вимога вивести в консоль
  });
};
