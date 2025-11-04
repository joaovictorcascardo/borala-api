import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { createSession } from "../validators/Session.Validator";
import { forgotPassword } from "../validators/Password.Validator";
import { resetPassword } from "../validators/Password.Validator";
import SessionController from "../controllers/Session.Controller";
import PasswordController from "../controllers/Password.Controller";

const authRoutes = Router();
authRoutes.post(
  "/sessions",
  validate(createSession),
  SessionController.createSession
);
authRoutes.post(
  "/forgot-password",
  validate(forgotPassword),
  PasswordController.forgotPassword
);
authRoutes.post(
  "/reset-password",
  validate(resetPassword),
  PasswordController.resetPassword
);
export { authRoutes };
