import { CreateRideDTO, RidesMeDTO, RideStatus, RideFilters } from "../dto/RideDTO";
import { VehicleData } from "../data/Vehicle.Data";
import { RideData } from "../data/Ride.Data";
import { EventData } from "../data/Event.Data";
import { Ride } from "../types/Ride";
import { toLowerCase, toUpperCase } from "zod";

class RideService {
  private vehicleData: VehicleData;
  eventData = new EventData();
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
    if (rideData.event_id) {
      const event = await this.eventData.existsEvent(Number(rideData.event_id))
      if (event == false) {
        throw new Error("Evento não encontrado.");
      }
    }
    if (!driverVehicle) {
      throw new Error("Veículo não encontrado ou não pertence ao motorista.");
    }
    const newRide = await this.rideData.create(driverId, rideData);
    return newRide;
  }
  async getMeRides(driver_id: number, page: number, limit: number): Promise<RidesMeDTO[]>{
    try{
      const rides = await this.rideData.getRides(driver_id, page, limit);
      if (rides.length === 0) {
        if (page === 1) {
          throw new Error("Você não possui nenhuma carona.");
        }
        else {
          throw new Error("Esta página não possui caronas.");
        }
      }
      return rides;
    }catch(error:any){
      throw new Error(error.message);
    }
  }
  async getRideById(RideId: number): Promise<RidesMeDTO[]>{
    try{
      const ride = await this.rideData.getRideById(RideId);
      if (ride.length === 0) {
        throw new Error("Nenhuma corrida encontrada com este ID.");
      }
      return ride;
    }catch(error: any){
      throw new Error(error.message);
    }
  }
  async patchRideStatus(rideId: number, driverId: number, rideStatus: string): Promise<RideStatus[]>{
    try{
      const upperRideStatus = rideStatus.toUpperCase();
      console.log(upperRideStatus)
      if (upperRideStatus != "IN_PROGRESS" && upperRideStatus != "COMPLETED" && upperRideStatus != "CANCELLED"){
        throw new Error("Status invalido! O status passado deve ser: 'IN_PROGRESS', 'COMPLETED' ou 'CANCELLED'.");
      }
      const updatedRide = await this.rideData.patchStatus(rideId, driverId, rideStatus);
      if (updatedRide.length === 0){
        throw new Error("Esta corrida não vinculada a você ou não existe.");
      }
      return updatedRide;
    }catch(error:any){
      throw new Error(error.message);
    }
  }
  async getRidesbyEventId(event_id: number, page: number, limit: number): Promise<RidesMeDTO[]>{
    try{
      const rides = await this.rideData.getRidesByEventId(event_id, page, limit)
      if (rides.length === 0) {
        if (page === 1) {
          throw new Error("Nenhuma carona encontrada para este evento.");
        }
        else {
          throw new Error("Esta página não possui caronas para este evento.");
        }
      }
      return rides;
    }catch(error: any){
      throw new Error(error.message);
    }
  }
  async getRides(page: number, limit: number, filters: RideFilters) {
    const rides = await this.rideData.getAllRides(page, limit, filters);
    if (rides.length === 0) {
      if (page === 1) {
        throw new Error("Nenhuma carona encontrada.");
      }
      else {
        throw new Error("Esta página não possui caronas.");
      }
    }
    return rides;
  }
}

export default new RideService();
