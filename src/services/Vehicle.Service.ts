import { CreateVehicleDTO, UpdateVehicleDTO } from "../dto/VehicleDTO";
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

  async update(
    vehicleId: number,
    userId: number,
    data: UpdateVehicleDTO
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleData.findById(vehicleId);

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    if (Number(vehicle.user_id) !== userId) {
      throw new Error(
        "Operação não permitida. Este veículo não pertence a você."
      );
    }

    return this.vehicleData.update(vehicleId, data);
  }

  async delete(vehicleId: number, userId: number): Promise<void> {
    const vehicle = await this.vehicleData.findById(vehicleId);

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    if (Number(vehicle.user_id) !== userId) {
      throw new Error(
        "Operação não permitida. Este veículo não pertence a você."
      );
    }

    await this.vehicleData.delete(vehicleId);
  }
}

export default new VehicleService();
