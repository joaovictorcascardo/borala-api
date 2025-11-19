export interface CreateEventDTO {
    name: String;
    address: String;
    latitude: number;
    longitude: number;
    starts_at: Date;
    ends_at: Date;
    description: String;
}
export interface EventsDTO {
    id: number;
    name: String;
    address: String;
    starts_at: Date;
}