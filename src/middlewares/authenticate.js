import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    throw createHttpError(401, 'Please provide access token');
  }

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    throw createHttpError(401, 'Please provide access token');
  }

  const session = await Session.findOne({ accessToken });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.accessTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findById(session.userId);

  if (user === null) {
    throw createHttpError(401, 'User not found');
  }

  req.user = { id: user._id, name: user.name };

  next();
};
