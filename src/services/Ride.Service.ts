import { CreateRideDTO } from "../dto/RideDTO";
import { VehicleData } from "../data/Vehicle.Data";
import { RideData } from "../data/Ride.Data";
import { Ride } from "../types/Ride";

class RideService {
  private vehicleData: VehicleData;
  private rideData: RideData;

  constructor() {
    this.vehicleData = new VehicleData();
    this.rideData = new RideData();
  }

  async create(driverId: number, rideData: CreateRideDTO): Promise<Ride> {
    const driverVehicle = await this.vehicleData.findByIdAndUserId(
      rideData.vehicle_id,
      driverId
    );
    if (!driverVehicle) {
      throw new Error("Veículo não encontrado ou não pertence ao motorista.");
    }
    const newRide = await this.rideData.create(driverId, rideData);
    return newRide;
  }
}

export default new RideService();
