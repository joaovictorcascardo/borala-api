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

export interface RidesMeDTO{
  vehicle_id: number ;
  event_id: number;
  origin_address: string;
  destination_addres: string;
  departure_time: Date ;
  available_seats: number ;
  estimated_total_cost: number | null;
  additional_info: number | null; 
} 
export interface RideStatus{
  id: number;
  driver_id: number;
  status: string;
}