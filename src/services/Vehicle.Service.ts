import {CreateVehicleDTO} from "../dto/VehicleDTO";
import { VehicleData } from "../data/Vehicle.Data"

export class VehicleService {
  vehicleData = new VehicleData();
  async create({
    brand,
    model,
    color,
    license_plate,
    year,
    seats,
    userId,
  }: CreateVehicleDTO) {
    await this.vehicleData.existingVehicle(license_plate);
    const newVehicle = await this.vehicleData.createVehicle({brand, model, color, license_plate, year, seats, userId});
    return newVehicle;
  }

  async FindByUserId(userId: number) {
    const UserVehicles = await this.vehicleData.FindByUserId(userId);
    return UserVehicles;
  }
}

export default new VehicleService();
