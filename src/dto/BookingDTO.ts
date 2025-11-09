import { BookingStatus } from "../types/Booking";

export interface CreateBookingDTO {
  seats_booked: number;
}

export interface UpdateBookingStatusDTO {
  status: "CONFIRMED" | "REJECTED" | "CANCELLED";
}

export interface ListMyBookingsDTO {
  id: number;
  status: BookingStatus;
  seats_booked: number;
  created_at: Date;
  ride: {
    id: number;
    origin_address: string;
    destination_address: string;
    departure_time: string;
  };
}
