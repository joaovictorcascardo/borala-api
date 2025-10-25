import { Request, Response } from "express";
import VehicleService from "../services/VehicleService";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

class VehicleController {
  async create(
    request: AuthenticatedRequest,
    response: Response
  ): Promise<Response> {
    console.log("--- VehicleController: create START ---");
    try {
      const { brand, model, color, license_plate, year, seats } = request.body;

      const userId = request.user?.id;

      if (!userId) {
        console.error(
          "Erro: ID do usuário não encontrado na requisição. O authMiddleware foi aplicado?"
        );
        return response.status(401).json({ error: "Usuário não autenticado." });
      }
      console.log(`Usuário ID: ${userId} tentando criar veículo.`);

      console.log("Chamando VehicleService.create...");
      const vehicle = await VehicleService.create({
        brand,
        model,
        color,
        license_plate,
        year,
        seats,
        userId,
      });
      console.log("VehicleService.create retornou:", vehicle);

      console.log("Enviando resposta 201...");
      return response.status(201).json(vehicle);
    } catch (error: any) {
      console.error("--- ERRO no VehicleController ---", error);
      if (error.message === "Veículo com esta placa já cadastrado.") {
        return response.status(409).json({ error: error.message });
      }
      return response
        .status(500)
        .json({ error: "Ocorreu um erro interno ao cadastrar o veículo." });
    }
  }
}

export default new VehicleController();
