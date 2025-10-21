import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { SessionValidator } from "../validators/SessionValidator";

const sessionRoutes = Router();

sessionRoutes.post("/", validate(SessionValidator.createSessions), (req, res) =>
  res.json({ message: "Login seria processado aqui!" })
);

export { sessionRoutes };
