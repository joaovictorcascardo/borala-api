import { db } from "../database/connection";
import { CreateEventDTO, EventsDTO} from "../dto/EventDTO"; 
export class EventData {
    async create(data: CreateEventDTO): Promise<CreateEventDTO[]> {
        try {
            const event = await db('events')
                .insert({
                    name: data.name,
                    address: data.address,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    starts_at: data.starts_at,
                    ends_at: data.ends_at,
                    description: data.description, 
                })
                .returning("*");
            return event;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    async getEvents(page: number, limit: number): Promise<EventsDTO[]>{
        try{
            const offset = (page - 1) * limit;
            const events = await db('events')
                .select(
                    "id",
                    "name",
                    "address",
                    "starts_at",
                )
                .limit(limit)
                .offset(offset)
            return events;
        }catch(error: any){
            throw new Error(error.message);
        }
    }
}