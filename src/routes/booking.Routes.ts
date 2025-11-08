import { Router } from "express";
import BookingController from "../controllers/Booking.Controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import { updateBooking } from "../validators/Booking.Validator";

const bookingRoutes = Router();

bookingRoutes.use(authMiddleware);
// bookingRoutes.post("/ride/:rideId/bookings", ...);
bookingRoutes.get("/me", BookingController.me);
bookingRoutes.patch(
  "/:id",
  validate(updateBooking),
  BookingController.patchStatus
);

export { bookingRoutes };
