import { EventData } from "../data/Event.Data";
import { CreateEventDTO } from "../dto/EventDTO";

class EventService {
    eventData = new EventData();
    public async create(data: CreateEventDTO): Promise<CreateEventDTO[]> {
        try {
            const event = await this.eventData.create(data);
            return event;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default new EventService();