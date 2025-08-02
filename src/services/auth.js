import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { RESET_PASSWORD_JWT_SECRET, APP_DOMAIN } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import createHttpError from 'http-errors';

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return user.toObject();
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return null;
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session || new Date() > session.refreshTokenValidUntil) {
    if (session) {
      await Session.deleteOne({ userId: session.userId });
    }
    return null;
  }

  await Session.deleteOne({ userId: session.userId });

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  const newAccessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const newRefreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: newAccessTokenValidUntil,
    refreshTokenValidUntil: newRefreshTokenValidUntil,
  });

  return newSession;
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      name: user.name,
      email: user.email,
    },
    RESET_PASSWORD_JWT_SECRET,
    { expiresIn: '15m' },
  );

  const resetPasswordLink = `${APP_DOMAIN}/reset-password?token=${resetToken}`;

  try {
    await sendMail({
      to: email,
      subject: 'Reset your password for Contacts Application',
      html: `
        <h1>Reset your password</h1>
        <p>Click on the link below to reset your password:</p>
        <a href="${resetPasswordLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, RESET_PASSWORD_JWT_SECRET);
    const userId = decoded.sub;
    const user = await User.findById(userId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, { password: encryptedPassword });
    await Session.deleteMany({ userId: user._id });
  } catch (error) {
    if (error.status === 404) {
      throw error;
    }
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};
