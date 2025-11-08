import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import { RideValidator } from "../validators/Ride.Validator";
import RideController from "../controllers/Ride.Controller";
import BookingController from "../controllers/Booking.Controller";
import { createBooking } from "../validators/Booking.Validator";

const rideRoutes = Router();

rideRoutes.post(
  "/",
  authMiddleware,
  validate(RideValidator.createRide),
  RideController.create
);

rideRoutes.post(
  "/:rideId/bookings",
  authMiddleware,
  validate(createBooking),
  BookingController.create
);

export { rideRoutes };
