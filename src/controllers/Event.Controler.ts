import { Request, Response } from "express";
import EventService from "../services/Event.Service";
import { AuthenticatedRequest } from "../types/Auth";
import { CreateEventDTO } from "../dto/EventDTO";

class EventController {
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const eventData: CreateEventDTO = req.body;
            const event = await EventService.create(eventData);
            return res.status(201).json(event);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ error: "Ocorreu um erro interno ao criar o evento." });
        }
    }
}
export default new EventController();