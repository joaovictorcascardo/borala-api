import { Response } from "express";
import { AuthenticatedRequest } from "../types/Auth";
import { CreateRideDTO } from "../dto/RideDTO";
import RideService from "../services/RideService";

interface CreateRideRequest extends AuthenticatedRequest {
  body: CreateRideDTO;
}

class RideController {
  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const request = req as CreateRideRequest;

    try {
      const driverId = request.user!.id;

      const rideData = request.body;

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
}

export default new RideController();
