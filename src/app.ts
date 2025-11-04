import express from "express";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.Routes";
import { vehicleRoutes } from "./routes/vehicle.routes";
import { rideRoutes } from "./routes/ride.routes";
import uploadConfig from "./upload-images/upload";

const app = express();
app.use(express.json());
app.use("/files", express.static(uploadConfig.directory));
app.use("/authenticator", authRoutes);
app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/rides", rideRoutes);

export { app };
