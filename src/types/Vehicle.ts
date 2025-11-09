export interface Vehicle {
  id: number;
  user_id: number;
  brand: string;
  model: string;
  color: string;
  license_plate: string;
  year: number;
  seats: number;
  created_at: Date;
  updated_at: Date;
}
