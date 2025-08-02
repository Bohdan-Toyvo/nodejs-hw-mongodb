import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestPasswordReset,
} from '../validation/authValidation.js';
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
  sendResetEmailController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshSessionController));

authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestPasswordReset),
  ctrlWrapper(sendResetEmailController),
);

export default authRouter;
