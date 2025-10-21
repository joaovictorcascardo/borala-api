import { Router } from "express";

const userController = {
  create: (request: any, response: any) => {
    return response.json({ message: "Usuário seria criado aqui!" });
  },
};

const userValidationMiddleware = (request: any, response: any, next: any) => {
  console.log("Validação passaria aqui!");
  next();
};

const userRoutes = Router();

userRoutes.post("/", userValidationMiddleware, userController.create);

export { userRoutes };
