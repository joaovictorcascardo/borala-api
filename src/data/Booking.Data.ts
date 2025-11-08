import { db } from "../database/connection";
import { Booking, BookingStatus } from "../types/Booking";

export class BookingData {
  async findById(id: number): Promise<Booking | undefined> {
    try {
      const booking = await db("bookings").where({ id }).first();
      return booking;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async findByRideAndPassenger(
    ride_id: number,
    passenger_id: number
  ): Promise<Booking | undefined> {
    try {
      const existing = await db("bookings")
        .where({ ride_id, passenger_id })
        .first();
      return existing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async create(
    rideId: number,
    passengerId: number,
    seatsBooked: number,
    status: BookingStatus
  ): Promise<Booking> {
    try {
      const [created] = await db("bookings")
        .insert({
          ride_id: rideId,
          passenger_id: passengerId,
          seats_booked: seatsBooked,
          status,
        })
        .returning("*");
      return created;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async listByPassenger(passengerId: number) {
    try {
      const rows = await db("bookings as b")
        .where("b.passenger_id", passengerId)
        .leftJoin("rides as r", "r.id", "b.ride_id")
        .select(
          "b.id",
          "b.status",
          "b.seats_booked",
          "b.created_at",
          "r.id as ride_id",
          "r.origin_address",
          "r.destination_address",
          "r.departure_time"
        )
        .orderBy("b.created_at", "desc");

      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async updateStatus(id: number, status: BookingStatus): Promise<Booking> {
    try {
      const [updatedBooking] = await db("bookings")
        .where({ id })
        .update({ status, updated_at: db.fn.now() })
        .returning("*");
      return updatedBooking;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
