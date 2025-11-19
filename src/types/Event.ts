<<<<<<< HEAD
export interface Events{
    name: string;
    addres: string;
    latitude: string;
    longitude: string;
    starts_at: Date;
    ends_at: Date;
    description: string;
=======
export interface Event {
    id: number;
    name: string;
    address: string;
    latitude: number;
    ends_at: Date;
    description: string | null;
    created_at: Date;
    updated_at: Date;
>>>>>>> bd9a409fcb9b83e28ad0db3e7589bd8f6e6b23d1
}