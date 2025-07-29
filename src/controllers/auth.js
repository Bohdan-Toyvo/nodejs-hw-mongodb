import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const payload = req.body;

  const user = await registerUser(payload);

  if (!user) {
    throw createHttpError(409, 'Email in use');
  }

  // Успішна відповідь
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const payload = req.body;

  const session = await loginUser(payload);

  if (!session) {
    throw createHttpError(401, 'Unauthorized');
  }

  const { refreshToken, accessToken } = session;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const session = await refreshSession({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found or invalid');
  }

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(204).send();
  }

  await logoutUser({ refreshToken });

  res.status(204).send();
};
