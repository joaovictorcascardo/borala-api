import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import EventController from "../controllers/Event.Controler";
import {EventValidator} from "../validators/Event.Validator"
import { authorize } from "../middlewares/authorization.middleware";
import RideController from "../controllers/Ride.Controller";

const eventsRoutes = Router();

eventsRoutes.post(
    "/",
    authMiddleware,
    authorize(["ADMIN"]),
    validate(EventValidator.createEvent),
    EventController.create
);
eventsRoutes.get(
    "/",
    EventController.getEvents
);
eventsRoutes.get(
    "/:id",
    validate(EventValidator.verifyId),
    EventController.getById
);
eventsRoutes.get(
    "/:id/rides",
    validate(EventValidator.verifyId),
    RideController.getRidesByEventId
);

export { eventsRoutes };