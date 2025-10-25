import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import VehicleController from "../controllers/VehicleController";
import { VehicleValidator } from "../validators/VehicleValidator";

const vehicleRoutes = Router();

vehicleRoutes.post(
  "/",
  authMiddleware,
  validate(VehicleValidator.createVehicle),
  VehicleController.create
);

export { vehicleRoutes };
