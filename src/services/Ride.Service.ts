import { CreateRideDTO } from "../dto/RideDTO";
import { VehicleData} from "../data/Vehicle.Data";
import { RideData } from "../data/Ride.Data";

class RideService {
  vehicleData = new VehicleData();
  rideData = new RideData()
  async create(driverId: number, rideData: CreateRideDTO) {
    await this.vehicleData.verifyVehicleByIdAndUserId(rideData.vehicle_id, driverId);
    const newRide = await this.rideData.create(driverId, rideData);
    return newRide;
  }
}

export default new RideService();
