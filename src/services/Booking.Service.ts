import { db } from "../database/connection";
import { BookingData } from "../data/Booking.Data";
import { RideData } from "../data/Ride.Data";
import { ListMyBookingsDTO } from "../dto/BookingDTO";
import { Booking, BookingStatus } from "../types/Booking";
import { Ride } from "../types/Ride";

export class BookingService {
  private bookingData: BookingData;
  private rideData: RideData;

  constructor() {
    this.bookingData = new BookingData();
    this.rideData = new RideData();
  }

  async create(
    rideId: number,
    passengerId: number,
    seatsBooked: number
  ): Promise<Booking> {
    const ride = await this.rideData.findById(rideId);

    if (!ride) {
      throw new Error("Corrida inválida.");
    }
    if (ride.driver_id === passengerId) {
      throw new Error("O motorista não pode reservar sua própria viagem.");
    }
    if (ride.status !== "SCHEDULED") {
      throw new Error("Esta corrida não está aceitando reservas.");
    }
    if (seatsBooked > ride.available_seats) {
      throw new Error("Número de assentos solicitados excede os disponíveis.");
    }
    const existingBooking = await this.bookingData.findByRideAndPassenger(
      rideId,
      passengerId
    );
    if (existingBooking) {
      throw new Error("Você já possui uma reserva para esta corrida.");
    }

    const newBooking = await this.bookingData.create(
      rideId,
      passengerId,
      seatsBooked,
      "PENDING"
    );

    return newBooking;
  }

  async listMyBookings(passengerId: number): Promise<ListMyBookingsDTO[]> {
    const rawBookings = await this.bookingData.listByPassenger(passengerId);

    const formattedBookings = rawBookings.map((row: any) => ({
      id: row.id,
      status: row.status,
      seats_booked: row.seats_booked,
      created_at: row.created_at,
      ride: {
        id: row.ride_id,
        origin_address: row.origin_address,
        destination_address: row.destination_address,
        departure_time: row.departure_time,
      },
    }));

    return formattedBookings;
  }

  async changeStatus(
    bookingId: number,
    userId: number,
    newStatus: "CONFIRMED" | "REJECTED" | "CANCELLED"
  ): Promise<Booking> {
    const booking = await this.bookingData.findById(bookingId);
    if (!booking) throw new Error("Reserva não localizada.");

    const ride = await this.rideData.findById(booking.ride_id);
    if (!ride) throw new Error("Corrida associada não localizada.");

    const prevStatus = booking.status;
    if (prevStatus === newStatus) return booking;

    if (newStatus === "CONFIRMED" || newStatus === "REJECTED") {
      if (ride.driver_id !== userId)
        throw new Error("Apenas o motorista pode confirmar ou rejeitar.");
      if (prevStatus !== "PENDING")
        throw new Error(
          `Não é possível ${newStatus} uma reserva que não está PENDENTE.`
        );
    } else if (newStatus === "CANCELLED") {
      if (booking.passenger_id !== userId)
        throw new Error("Apenas o passageiro pode cancelar sua reserva.");
    }
    let seatChange = 0;

    if (newStatus === "CONFIRMED") {
      seatChange = -booking.seats_booked;
      if (ride.available_seats + seatChange < 0) {
        throw new Error(
          "Não há assentos suficientes para confirmar esta reserva."
        );
      }
    } else if (
      (newStatus === "CANCELLED" || newStatus === "REJECTED") &&
      prevStatus === "CONFIRMED"
    ) {
      seatChange = +booking.seats_booked;
    }

    if (seatChange !== 0) {
      return db.transaction(async (trx) => {
        await trx("rides")
          .where({ id: ride.id })
          .update({
            available_seats: ride.available_seats + seatChange,
            updated_at: db.fn.now(),
          });

        const [updatedBooking] = await trx("bookings")
          .where({ id: booking.id })
          .update({
            status: newStatus,
            updated_at: db.fn.now(),
          })
          .returning("*");

        return updatedBooking;
      });
    } else {
      return this.bookingData.updateStatus(booking.id, newStatus);
    }
  }
}
export default new BookingService();
