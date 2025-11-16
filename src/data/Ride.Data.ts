import { db } from "../database/connection";
import { CreateRideDTO, RidesMeDTO, RideStatus, RideFilters} from "../dto/RideDTO";
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
  async getRides(driver_id: number, page: number, limit: number): Promise<RidesMeDTO[]>{
    try{
      const offset = (page - 1) * limit;
      const rides = await db("rides")
        .select('vehicle_id', 'event_id', 'origin_address', 'destination_address', 'departure_time', 'available_seats', 'estimated_total_cost','additional_info' )
        .where({ driver_id })
        .limit(limit)
        .offset(offset);
      return rides;
    }catch(error: any){
      throw new Error(error.message);
    }
  }
  async getRideById(id: number): Promise<RidesMeDTO[]>{
    try {
      const ride = await db("rides")
        .select("vehicle_id", "event_id", "origin_address", "destination_address", "departure_time", "available_seats", "estimated_total_cost", "additional_info")
        .where({ id });
      return ride;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async patchStatus(id: number, driver_id: number, status: string): Promise<RideStatus[]>{
    try{
      const updatedRide = await db("rides")
        .where({ id: id })
        .andWhere({ driver_id: driver_id })
        .update({ status: status }).returning(["id", "driver_id", "status"]) as RideStatus[];
      return updatedRide;
    }catch(error: any){
      throw new Error(error.message);
    }
  }
  async getRidesByEventId(event_id: number, page: number, limit: number): Promise<RidesMeDTO[]>{
    try {
      const offset = (page - 1) * limit;
      const rides = await db("rides")
        .select("vehicle_id", "event_id", "origin_address", "destination_address", "departure_time", "available_seats", "estimated_total_cost", "additional_info")
        .where({ event_id: event_id })
        .limit(limit)
        .offset(offset);
      return rides;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllRides(page: number, limit: number, filters: RideFilters): Promise<Ride[]> {
    try {
      const offset = (page - 1) * limit;
      const query = db("rides").select("*");
      if (filters.maxCost) {
        query.where("estimated_total_cost", "<=", filters.maxCost);
      }
      if (filters.destination) {
        query.where("destination_address", "ilike", "%" + filters.destination + "%");
      }
      if (filters.origin) {
        query.where("origin_address", "ilike", "%" + filters.origin + "%");
      }
      if (filters.date) {
        query.whereRaw("DATE(departure_time) = ?", filters.date);
      }
      query.limit(limit)
        .offset(offset);
      const rides = await query;
      return rides;

    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
