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
    async getEvents(req: Request, res: Response): Promise<Response>{
        try{
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const events = await EventService.getEvents(page, limit);
            return res.status(200).json(events);
        }catch(error:any){
            if (error.message === "Esta página não possui eventos.") {
                return res.status(200).json({ atenção: error.message });
            }
            if (error.message === "Nenhum evento cadastrado."){
                return res.status(200).json({ atenção: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: "Ocorreu um erro interno ao retornar os eventos." });
        }
    }
}
export default new EventController();