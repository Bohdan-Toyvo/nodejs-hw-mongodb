import pino from 'pino';

const logger = pino();

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  const message = status === 500 ? 'Something went wrong' : err.message;

  logger.error(err);

  res.status(status).json({
    status: status,
    message: message,
    data: err.data || null,
  });
};
