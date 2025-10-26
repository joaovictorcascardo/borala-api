import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from "../middlewares/validation.middleware";
import { UserValidator } from "../validators/UserValidator";

const userRoutes = Router();

userRoutes.post("/", validate(UserValidator.createUser), UserController.create);
userRoutes.use(authMiddleware);
userRoutes.get("/:id", UserController.getUserById);
userRoutes.get("/me", UserController.getMe);
userRoutes.put("/me", validate(UserValidator.updateUser),UserController.updateMe);

export { userRoutes };
