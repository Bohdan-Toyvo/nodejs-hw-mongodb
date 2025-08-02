import nodemailer from 'nodemailer';
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
} from './env.js';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendMail = async (mailOptions) => {
  mailOptions.from = SMTP_FROM;

  return await transporter.sendMail(mailOptions);
};
