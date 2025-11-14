export interface CreateEventDTO {
    name: String;
    address: String;
    latitude: number;
    longitude: number;
    starts_at: Date;
    ends_at: Date;
    description: String;
}