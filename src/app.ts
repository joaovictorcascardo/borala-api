import express from "express";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.Routes";
import { vehicleRoutes } from "./routes/vehicle.routes";
import { rideRoutes } from "./routes/ride.routes";
import uploadConfig from "./upload-images/upload";
import { bookingRoutes } from "./routes/booking.Routes";
<<<<<<< HEAD
=======
import { eventsRoutes } from "./routes/event.routes";

>>>>>>> bd9a409fcb9b83e28ad0db3e7589bd8f6e6b23d1
const app = express();
app.use(express.json());
app.use("/files", express.static(uploadConfig.directory));
app.use("/authenticator", authRoutes);
app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/rides", rideRoutes);
app.use("/bookings", bookingRoutes);
app.use("/events", eventsRoutes);
export { app };
