import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import VehicleController from "../controllers/Vehicle.Controller";
import { VehicleValidator } from "../validators/Vehicle.Validator";

const vehicleRoutes = Router();

vehicleRoutes.get("/", authMiddleware, VehicleController.list);

vehicleRoutes.post(
  "/",
  authMiddleware,
  validate(VehicleValidator.createVehicle),
  VehicleController.create
);

export { vehicleRoutes };
