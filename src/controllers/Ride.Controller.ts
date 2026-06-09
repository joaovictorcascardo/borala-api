import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/Auth";
import { CreateRideDTO } from "../dto/RideDTO";
import RideService from "../services/Ride.Service";
import { rideRoutes } from "../routes/ride.routes";
import { getRouteMetrics } from "../services/RouteMetrics.Service";

class RideController {
  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const driverId = req.user!.id;

      const rideData = req.body as CreateRideDTO;

      const newRide = await RideService.create(driverId, rideData);

      return res.status(201).json(newRide);
    } catch (error: any) {
      if (error.message === "Veículo não encontrado ou não pertence ao motorista.") {
        return res.status(400).json({ error: error.message });
      }
      if(error.message === "Evento não encontrado."){
        return res.status(400).json("Impossível criar carona: " + error.message);
      }
      console.error(error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao criar a carona." });
    }
  }
  async getRides(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
      const destination = req.query.destination as string | undefined;
      const origin = req.query.origin as string | undefined;
      const date = req.query.date as string | undefined;
      const maxCost = req.query.maxCost? Number(req.query.maxCost): undefined;
      const orderBy = req.query.orderBy as string | undefined;
      const orderDirection = req.query.orderDirection as string | undefined;
      const status = req.query.status as string | undefined;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const filters = { destination, origin, date, maxCost, orderBy, orderDirection, status };
      
      const rides = await RideService.getRides(page, limit, filters)
      return res.status(200).json(rides);
    } catch (error: any){
      if (error.message === "Esta página não possui caronas.") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Nenhuma carona encontrada.") {
        return res.status(404).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao listar as caronas." });
    }
  }


  async getRidesMe(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const userId = req.user!.id;
      const meRides = await RideService.getMeRides(userId, page, limit );
      return res.status(200).json(meRides);
    }catch(error: any){
      if (error.message === "Esta página não possui caronas."){
        return res.status(404).json({ error: error.message });    
      }
      if (error.message === "Você não possui nenhuma carona."){
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
      if (error.message === "Carona não encontrada."){
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Você não tem permissão para alterar esta carona.") {
        return res.status(403).json({ error: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao atualizar o status dessa corrida." });
    }
  }
  async getMetrics(req: Request, res: Response): Promise<Response> {
    try {
      const rideId = Number(req.params.id);
      const ride = await RideService.getRideById(rideId);
      const metrics = await getRouteMetrics(ride.origin_address, ride.destination_address);
      return res.status(200).json(metrics);
    } catch (error: any) {
      if (error.message === "Nenhuma corrida encontrada com este ID.") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao calcular métricas da rota." });
    }
  }

  async getRidesByEventId(req: Request, res: Response){
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const eventId = Number(req.params.id); 
      const rides = await RideService.getRidesbyEventId(eventId, page, limit)
      return res.status(200).json(rides);
    }catch(error: any){
      console.error(error);
      if (error.message === "Esta página não possui caronas para este evento.") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Nenhuma carona encontrada para este evento."){
        return res.status(404).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao retornar caronas para este evento." });
    }
    }
}
export default new RideController();
