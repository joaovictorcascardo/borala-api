import { CreateVehicleDTO } from "../dto/VehicleDTO";
import { VehicleData } from "../data/Vehicle.Data";
import { Vehicle } from "../types/Vehicle";

export class VehicleService {
  private vehicleData: VehicleData;

  constructor() {
    this.vehicleData = new VehicleData();
  }

  async create({
    brand,
    model,
    color,
    license_plate,
    year,
    seats,
    userId,
  }: CreateVehicleDTO): Promise<Vehicle> {
    const existingVehicle = await this.vehicleData.findByLicensePlate(
      license_plate
    );

    if (existingVehicle) {
      throw new Error("Veículo com esta placa já cadastrado.");
    }

    const newVehicle = await this.vehicleData.createVehicle({
      brand,
      model,
      color,
      license_plate,
      year,
      seats,
      userId,
    });
    return newVehicle;
  }

  async FindByUserId(userId: number) {
    const UserVehicles = await this.vehicleData.FindByUserId(userId);
    return UserVehicles;
  }
}

export default new VehicleService();
