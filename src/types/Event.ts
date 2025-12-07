export interface Event {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  starts_at: Date;
  ends_at: Date;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
