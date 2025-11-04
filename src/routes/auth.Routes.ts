import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { createSession } from "../validators/SessionValidator";
import { forgotPassword } from "../validators/PasswordValidator";
import { resetPassword } from "../validators/PasswordValidator";
import SessionController from "../controllers/SessionController";
import PasswordController from "../controllers/PasswordController";

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
