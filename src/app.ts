import express from "express";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/authRoutes";
import { vehicleRoutes } from "./routes/vehicle.routes";

const app = express();
app.use(express.json());
app.use("/authenticator", authRoutes);
app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);

export { app };
