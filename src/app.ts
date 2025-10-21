import express from "express";
import { userRoutes } from "./routes/user.routes";

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  return response.json({ message: "API BoraLá no ar!" });
});

app.use("/users", userRoutes);

export { app };
