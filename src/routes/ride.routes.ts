import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import { RideValidator } from "../validators/Ride.Validator";
import RideController from "../controllers/Ride.Controller";
import BookingController from "../controllers/Booking.Controller";
import ReviewController from "../controllers/Review.Controller";
import { createBooking } from "../validators/Booking.Validator";
import { createReview } from "../validators/Review.Validator";

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

rideRoutes.post(
  "/:rideId/reviews",
  authMiddleware,
  validate(createReview),
  ReviewController.create
);

rideRoutes.get(
  "/:id",
  authMiddleware,
  validate(RideValidator.verifyId),
  RideController.getById
);
rideRoutes.patch(
  "/:id/status",
  authMiddleware,
  validate(RideValidator.statusRide),
  RideController.patchRide
);
export { rideRoutes };
