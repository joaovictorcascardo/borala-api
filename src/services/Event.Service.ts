import { EventData } from "../data/Event.Data";
import { CreateEventDTO, EventsDTO } from "../dto/EventDTO";

class EventService {
    eventData = new EventData();
    async create(data: CreateEventDTO): Promise<CreateEventDTO[]> {
        try {
            const event = await this.eventData.create(data);
            return event;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    async getEvents(page: number, limit: number):Promise<EventsDTO[]>{
        try {
            const events = await this.eventData.getEvents(page, limit);
            if (events.length === 0) {
                if (page === 1) {
                    throw new Error("Nenhum evento cadastrado.");
                }
                else {
                    throw new Error("Esta página não possui eventos.");
                }
            }

            return events;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default new EventService();