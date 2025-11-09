export interface CreateVehicleDTO {
  brand: string;
  model: string;
  color: string;
  license_plate: string;
  year: number;
  seats: number;
  userId: number;
}

export interface UpdateVehicleDTO {
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  seats?: number;
}
