import { Response } from "express";
import BookingService from "../services/Booking.Service";
import { AuthenticatedRequest } from "../types/Auth";

export default class BookingController {
  static async create(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const rideId = Number(req.params.rideId);
      const passengerId = req.user!.id;
      const { seats_booked } = req.body;
      const booking = await BookingService.create(
        rideId,
        passengerId,
        seats_booked
      );

      return res.status(201).json(booking);
    } catch (err: any) {
      if (
        err.message.includes("inválida") ||
        err.message.includes("não pode reservar") ||
        err.message.includes("não está aceitando") ||
        err.message.includes("excede os disponíveis") ||
        err.message.includes("já possui")
      ) {
        return res.status(400).json({ message: err.message }); // 400 Bad Request
      }

      console.error("Erro ao criar reserva:", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async me(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const passengerId = req.user!.id;

      const list = await BookingService.listMyBookings(passengerId);
      return res.status(200).json(list);
    } catch (err: any) {
      console.error("Erro ao listar reservas:", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async byRide(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const rideId = Number(req.params.rideId);
      const requesterId = req.user!.id;
      const list = await BookingService.listByRide(rideId, requesterId);
      return res.status(200).json(list);
    } catch (err: any) {
      if (
        err.message.includes("não encontrada") ||
        err.message.includes("Apenas o motorista")
      ) {
        return res.status(403).json({ message: err.message });
      }
      console.error("Erro ao listar reservas da corrida:", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async patchStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const bookingId = Number(req.params.id);
      const userId = req.user!.id;
      const { status } = req.body;
      const updated = await BookingService.changeStatus(
        bookingId,
        userId,
        status
      );
      return res.status(200).json(updated);
    } catch (err: any) {
      if (
        err.message.includes("não localizada") ||
        err.message.includes("Apenas o motorista") ||
        err.message.includes("Apenas o passageiro") ||
        err.message.includes("Não é possível") ||
        err.message.includes("assentos suficientes")
      ) {
        return res.status(403).json({ message: err.message });
      }

      console.error("Erro ao alterar status da reserva:", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
