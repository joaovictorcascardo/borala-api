import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import { RideValidator } from "../validators/Ride.Validator";
import RideController from "../controllers/Ride.Controller";

const rideRoutes = Router();

rideRoutes.post(
  "/",
  authMiddleware,
  validate(RideValidator.createRide),
  RideController.create
);

export { rideRoutes };
