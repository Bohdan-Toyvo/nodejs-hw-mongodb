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
