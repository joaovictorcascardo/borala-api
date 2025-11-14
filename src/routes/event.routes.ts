import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import EventController from "../controllers/Event.Controler";
import {EventValidator} from "../validators/Event.Validator"
import { authorize } from "../middlewares/authorization.middleware";

const eventsRoutes = Router();

eventsRoutes.post(
    "/",
    authMiddleware,
    authorize(["ADMIN"]),
    validate(EventValidator.createEvent),
    EventController.create
);

export { eventsRoutes };