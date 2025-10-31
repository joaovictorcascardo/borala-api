import { Response } from "express";
import BookingService from "../services/BookingService";
import { AuthenticatedRequest } from "../types/Auth";

export default class BookingController {
    static async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const rideId = Number(req.params.rideId);
            if (!Number.isFinite(rideId)) return res.status(400).json({ message: "rideId inválido." });

            const passengerId = req.user?.id;
            if (!Number.isFinite(passengerId)) return res.status(401).json({ message: "Usuário não autenticado." });

            if (!passengerId) {
                throw new Error("ID do passageiro nescessario");
            }

            const { seats_booked } = req.body;
            const booking = await BookingService.create(rideId, passengerId, seats_booked);
            return res.status(201).json(booking);
        } catch (err: any) {
            return res.status(err.status || 500).json({ message: err.message || "Erro interno do servidor." });
        }
    }

    static async me(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const passengerId = req.user?.id;
            if (!Number.isFinite(passengerId)) return res.status(401).json({ message: "Usuário não autenticado." });

            if (!passengerId) {
                throw new Error("ID do passageiro nescessario");
            }

            const list = await BookingService.listByUser(passengerId);
            return res.status(200).json(list);
        } catch (err: any) {
            return res.status(err.status || 500).json({ message: err.message || "Erro interno do servidor." });
        }
    }

    static async patchStatus(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const bookingId = Number(req.params.id);
            if (!Number.isFinite(bookingId)) return res.status(400).json({ message: "id da reserva inválido." });

            const userId = req.user?.id;
            if (!Number.isFinite(userId)) return res.status(401).json({ message: "Usuário não autenticado." });

            if (!userId) {
                throw new Error("Passenger ID is required");
            }

            const { status } = req.body;
            const updated = await BookingService.changeStatus(bookingId, userId, status);
            return res.status(200).json(updated);
        } catch (err: any) {
            return res.status(err.status || 500).json({ message: err.message || "Erro interno do servidor." });
        }
    }
}