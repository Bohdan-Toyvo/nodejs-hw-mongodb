import 'dotenv/config';

const getEnvVar = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined!`);
  }
  return value;
};

export const MONGODB_USER = getEnvVar('MONGODB_USER');
export const MONGODB_PASSWORD = getEnvVar('MONGODB_PASSWORD');
export const MONGODB_URL = getEnvVar('MONGODB_URL');
export const MONGODB_DB = getEnvVar('MONGODB_DB');
export const PORT = getEnvVar('PORT');

export const SMTP_HOST = getEnvVar('SMTP_HOST');
export const SMTP_PORT = getEnvVar('SMTP_PORT');
export const SMTP_USER = getEnvVar('SMTP_USER');
export const SMTP_PASSWORD = getEnvVar('SMTP_PASSWORD');
export const SMTP_FROM = getEnvVar('SMTP_FROM');
export const RESET_PASSWORD_JWT_SECRET = getEnvVar('RESET_PASSWORD_JWT_SECRET');
export const APP_DOMAIN = getEnvVar('APP_DOMAIN');
