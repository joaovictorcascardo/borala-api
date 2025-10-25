import { db } from "../database/connection";
import {CreateVehicleDTO} from "../types/Vehicle";

class VehicleService {
  async create({
    brand,
    model,
    color,
    license_plate,
    year,
    seats,
    userId,
  }: CreateVehicleDTO) {
    const existingVehicle = await db("vehicles")
      .where({ license_plate })
      .first();

    if (existingVehicle) {
      throw new Error("Veículo com esta placa já cadastrado.");
    }

    const [newVehicle] = await db("vehicles")
      .insert({
        brand,
        model,
        color,
        license_plate,
        year,
        seats,
        user_id: userId,
      })
      .returning("*");

    return newVehicle;
  }
}

export default new VehicleService();
