import { Response } from "express";
import VehicleService from "../services/Vehicle.Service";
import { AuthenticatedRequest } from "../types/Auth";

class VehicleController {
  async create(
    request: AuthenticatedRequest,
    response: Response
  ): Promise<Response> {
    try {
      const { brand, model, color, license_plate, year, seats } = request.body;
      const userId = request.user?.id;

      if (!userId) {
        console.error(
          "Erro: ID do usuário não encontrado na requisição. O authMiddleware foi aplicado?"
        );
        return response.status(401).json({ error: "Usuário não autenticado." });
      }

      const vehicle = await VehicleService.create({
        brand,
        model,
        color,
        license_plate,
        year,
        seats,
        userId,
      });

      return response.status(201).json(vehicle);
    } catch (error: any) {
      console.error("--- ERRO no VehicleController: create ---", error);
      if (error.message === "Veículo com esta placa já cadastrado.") {
        return response.status(409).json({ error: error.message });
      }
      return response
        .status(500)
        .json({ error: "Ocorreu um erro interno ao cadastrar o veículo." });
    }
  }

  async list(
    request: AuthenticatedRequest,
    response: Response
  ): Promise<Response> {
    try {
      const userId = request.user!.id;
      const vehicles = await VehicleService.FindByUserId(userId);
      return response.status(200).json(vehicles);
    } catch (error: any) {
      console.error("Erro ao listar veículos:", error);
      return response
        .status(500)
        .json({ error: "Ocorreu um erro interno ao listar os veículos." });
    }
  }

  async update(
    request: AuthenticatedRequest,
    response: Response
  ): Promise<Response> {
    try {
      const vehicleId = Number(request.params.id);
      const userId = request.user!.id;
      const data = request.body;

      const updatedVehicle = await VehicleService.update(
        vehicleId,
        userId,
        data
      );

      return response.status(200).json(updatedVehicle);
    } catch (error: any) {
      if (error.message.includes("Veículo não encontrado")) {
        return response.status(404).json({ error: error.message });
      }
      if (error.message.includes("Operação não permitida")) {
        return response.status(403).json({ error: error.message });
      }

      console.error("Erro ao ATUALIZAR veículo:", error);
      return response
        .status(500)
        .json({ error: "Ocorreu um erro interno ao atualizar o veículo." });
    }
  }

  async delete(
    request: AuthenticatedRequest,
    response: Response
  ): Promise<Response> {
    try {
      const vehicleId = Number(request.params.id);
      const userId = request.user!.id;

      await VehicleService.delete(vehicleId, userId);

      return response.status(204).send();
    } catch (error: any) {
      if (error.message.includes("Veículo não encontrado")) {
        return response.status(404).json({ error: error.message });
      }
      if (error.message.includes("Operação não permitida")) {
        return response.status(403).json({ error: error.message });
      }

      console.error("Erro ao DELETAR veículo:", error);
      return response
        .status(500)
        .json({ error: "Ocorreu um erro interno ao deletar o veículo." });
    }
  }
}

export default new VehicleController();
