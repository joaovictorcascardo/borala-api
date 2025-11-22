export interface CreateRideDTO {
  vehicle_id: number;
  event_id?: number | null;
  origin_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  departure_time: Date;
  available_seats: number;
  estimated_total_cost?: number | null;
  additional_info?: string | null;
  automatic_approval?: boolean;
}

export type RideStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface RidesMeDTO {
  id?: number;
  vehicle_id: number;
  event_id?: number | null;
  origin_address: string;
  destination_address: string;
  departure_time: Date;
  available_seats: number;
  estimated_total_cost: number | null;
  additional_info: string | null;
  status?: RideStatus;
}

export interface RideFilters {
  destination?: string;
  origin?: string;
  date?: string;
  maxCost?: number;
  orderBy?: string;
  orderDirection?: string;
  status?: string;
}
