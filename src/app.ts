import express from "express";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/authRoutes";

const app = express();
app.use(express.json());
app.use("/authenticator", authRoutes);
app.use("/users", userRoutes);

export { app };
