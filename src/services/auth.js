import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { randomBytes } from 'crypto';

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
