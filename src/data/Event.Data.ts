import { db } from "../database/connection";
import { CreateEventDTO } from "../dto/EventDTO"; 
export class EventData {
    public async create(data: CreateEventDTO): Promise<CreateEventDTO[]> {
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
}