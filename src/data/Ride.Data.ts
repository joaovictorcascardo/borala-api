import { db } from "../database/connection";
import { CreateRideDTO, RidesMeDTO } from "../dto/RideDTO";
import { Ride } from "../types/Ride";

export class RideData {
  async create(driverId: number, rideData: CreateRideDTO): Promise<Ride> {
    try {
      const dataToInsert = {
        ...rideData,
        driver_id: driverId,
        status: "SCHEDULED",
      };
      const [newRide] = await db("rides").insert(dataToInsert).returning("*");
      return newRide;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async findById(id: number): Promise<Ride | undefined> {
    try {
      const ride = await db("rides").where({ id }).first();
      return ride;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async updateAvailableSeats(id: number, newSeatCount: number): Promise<Ride> {
    try {
      const [updatedRide] = await db("rides")
        .where({ id })
        .update({
          available_seats: newSeatCount,
          updated_at: db.fn.now(),
        })
        .returning("*");
      return updatedRide;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getRides(driver_id: number): Promise<RidesMeDTO[]>{
    try{
      const rides = await db("rides")
        .select('vehicle_id', 'event_id', 'origin_address', 'destination_address', 'departure_time', 'available_seats', 'estimated_total_cost','additional_info' )
        .where({ driver_id });
      return rides
    }catch(error: any){
      throw new Error(error.message);
    }
  }
}
