export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export interface Booking {
  id: number;
  ride_id: number;
  passenger_id: number;
  seats_booked: number;
  status: BookingStatus;
  created_at: Date;
  updated_at: Date;
}
