export interface Event {
    id: number;
    name: string;
    address: string;
    latitude: number;
    ends_at: Date;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}