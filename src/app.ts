import express from "express";
import { userRoutes } from "./routes/user.routes";
import { sessionRoutes } from "./routes/session.routes";

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  return response.json({ message: "API BoraLá no ar!" });
});

app.use("/users", userRoutes);
app.use('/sessions', sessionRoutes);

export { app };
