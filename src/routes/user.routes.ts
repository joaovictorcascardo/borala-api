import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from "../middlewares/validation.middleware";
import { UserValidator } from "../validators/UserValidator";
import multer from "multer";
import uploadConfig from '../upload-images/upload';

const userRoutes = Router();
const upload = multer(uploadConfig)

userRoutes.post("/", validate(UserValidator.createUser), UserController.create);
userRoutes.use(authMiddleware);
userRoutes.get("/me", UserController.getMe);
userRoutes.put("/me", validate(UserValidator.updateUser),UserController.updateMe);
userRoutes.patch("/me/avatar", upload.single("file"), UserController.changeAvatar);
userRoutes.get("/:id", validate(UserValidator.getUserById), UserController.getUserById);

export { userRoutes };
