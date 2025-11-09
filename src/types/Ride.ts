export type RideStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export interface Ride {
  id: number;
  driver_id: number;
  vehicle_id: number;
  event_id: number | null;
  origin_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  departure_time: Date;
  available_seats: number;
  status: RideStatus;
  additional_info: string | null;
  estimated_total_cost: number | null;
  automatic_approval: boolean;
  created_at: Date;
  updated_at: Date;
}
