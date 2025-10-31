import { Router } from "express";
import BookingController from "../controllers/BookingController";
import { authMiddleware } from "../middlewares/authMiddleware"; 
import { validate } from "../middlewares/validation.middleware";
import { createBooking, updateBooking } from "../validators/BookingValidator";

const userRoutes = Router();

userRoutes.post("/ride/:rideId/bookings", validate(createBooking), BookingController.create);

userRoutes.get("/me/bookings", authMiddleware, BookingController.me);

userRoutes.patch("/bookings/:id", validate(updateBooking),BookingController.patchStatus);