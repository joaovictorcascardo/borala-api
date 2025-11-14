import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/Auth";
import { CreateRideDTO } from "../dto/RideDTO";
import RideService from "../services/Ride.Service";

class RideController {
  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const driverId = req.user!.id;

      const rideData = req.body as CreateRideDTO;

      const newRide = await RideService.create(driverId, rideData);

      return res.status(201).json(newRide);
    } catch (error: any) {
      if (
        error.message === "Veículo não encontrado ou não pertence ao motorista."
      ) {
        return res.status(400).json({ error: error.message });
      }

      console.error(error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao criar a carona." });
    }
  }
  async getRidesMe(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
      const userId = req.user!.id;
      const meRides = await RideService.getMeRides(userId);
      return res.status(200).json(meRides);
    }catch(error: any){
      if (error.message === "Você não possui nenhuma corrida."){
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao criar a carona." });
    }
  }
  async getById(req: Request, res: Response): Promise<Response>{
    try{
      const rideId = Number(req.params.id);
      const ride = await RideService.getRideById(rideId);
      return res.status(200).json(ride);
    }catch(error: any){
      if (error.message === "Nenhuma corrida encontrada com este ID."){
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao retornar a carona." });
    }
  }
  async patchRide(req: AuthenticatedRequest, res: Response){
    try{
      const { status } = req.body;
      const rideId = Number(req.params.id);
      const driver_Id = Number(req.user!.id)
      const updatedRide = await RideService.patchRideStatus(rideId, driver_Id, status);
      return res.status(200).json(updatedRide);
    }catch(error: any){
      if (error.message ==="Status invalido! O status passado deve ser: 'IN_PROGRESS', 'COMPLETED' ou 'CANCELLED'.") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Esta corrida não vinculada a você ou não existe."){
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao atualizar o status dessa corrida." });
    }
  }
}
export default new RideController();
