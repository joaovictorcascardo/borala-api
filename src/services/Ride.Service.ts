import { db } from "../database/connection";
import { CreateRideDTO } from "../dto/RideDTO";
class RideService {
  async create(driverId: number, rideData: CreateRideDTO) {
    const vehicle = await db("vehicles")
      .where({
        id: rideData.vehicle_id,
        user_id: driverId,
      })
      .first();

    if (!vehicle) {
      throw new Error("Veículo não encontrado ou não pertence ao motorista.");
    }

    const dataToInsert = {
      ...rideData,
      driver_id: driverId,
      status: "SCHEDULED",
    };

    const [newRide] = await db("rides").insert(dataToInsert).returning("*");
    return newRide;
  }
}

export default new RideService();
