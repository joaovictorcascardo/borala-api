export interface CreateBooking {
    id: number;
}

export interface UpdateBooking {
    id: number;
    ride_id: number;
    passenger_id: number;
    seats_booked: number;
    status: string;
    create_at: Date;
}

export interface GETBookingMe {
    id: number;
    status: string;
    ride: {
        id: number;
        oringin_address: string;
        destination_address: string;
        depature_time: string
    }
}