import { db } from "../database/connection";
import { CreateRideDTO } from "../dto/RideDTO";
export class RideData {
    async create(driverId: number, rideData: CreateRideDTO) {
        try{
            const dataToInsert = {
                ...rideData,
                driver_id: driverId,
                status: "SCHEDULED",
            };
            const newRide = await db("rides").insert(dataToInsert).returning("*");
            return newRide
        }catch(error: any){
            throw new Error(error.message);
        }
    }
}