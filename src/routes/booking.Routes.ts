import { Router } from "express";
import BookingController from "../controllers/Booking.Controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import { createBooking, updateBooking } from "../validators/Booking.Validator";

const bookingRoutes = Router();

bookingRoutes.use(authMiddleware);
bookingRoutes.post(
  "/ride/:rideId/bookings",
  validate(createBooking),
  BookingController.create
);
bookingRoutes.get("/me/bookings", BookingController.me);
bookingRoutes.patch(
  "/bookings/:id",
  validate(updateBooking),
  BookingController.patchStatus
);

export { bookingRoutes };
