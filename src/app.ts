import express from "express";
import cors from "cors";

import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.Routes";
import { vehicleRoutes } from "./routes/vehicle.routes";
import { rideRoutes } from "./routes/ride.routes";
import uploadConfig from "./upload-images/upload";
import { bookingRoutes } from "./routes/booking.Routes";
import { eventsRoutes } from "./routes/event.routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";

const app = express();
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use("/files", express.static(uploadConfig.directory));
app.use("/authenticator", authRoutes);
app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/rides", rideRoutes);
app.use("/bookings", bookingRoutes);
app.use("/events", eventsRoutes);

export { app };
