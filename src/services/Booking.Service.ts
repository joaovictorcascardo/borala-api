import { error } from "console";
import { db } from "../database/connection";

type NewStatus = "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING";

export default class BookingService {
    static async create(rideId: Number, passengerId: number, seatsBooked: number) {
        if (!Number.isFinite(rideId) || !Number.isFinite(passengerId)) {
            throw new Error("rideId ou passengerId inválidos.");
        }
        if (!Number.isFinite(seatsBooked) || seatsBooked < 1) {
            throw new Error("seats_booked inválidos.");
        }

        return await db.transaction(async (trx) => {
            const ride = await trx("corridas").where("id", rideId).first();
            if (!ride) throw new Error("Corrida inválida.");
            if (ride.status !== "SCHEDULED") throw new Error("Corrida não aberta para corridas");
            if (ride.drive_id === passengerId) throw new Error("O motorista não pode reservar sua própria viagem.");
            if (seatsBooked > ride.avalible_seats) throw new Error("Numero de lugares insuficientes");

            const existing = await trx("corridas").where({ ride_id: rideId, passenger_id: passengerId }).first();
            if (existing) {
                throw new Error("Corrida já existe para esse usuario e corrida.");
            }

            const automatic = !!ride.automatic_approval;
            const status: NewStatus = automatic ? "CONFIRMED" : "PENDING";

            if (automatic) {
              await trx("rides").where("id", rideId).update({
                available_seats: ride.available_seats - seatsBooked,
              });
            }

            const [created] = await trx("bookings")
              .insert({
                ride_id: rideId,
                passenger_id: passengerId,
                seats_booked: seatsBooked,
                status,
              })
              .returning("*");

              return created;
        });
    }

    static async listByUser(passengerId: number) {
    if (!Number.isFinite(passengerId)) throw new Error("ID do passageiro inválido");

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

    return rows.map((r: any) => ({
      id: r.id,
      status: r.status,
      seats_booked: r.seats_booked,
      created_at: r.created_at,
      ride: {
        id: r.ride_id,
        origin_address: r.origin_address,
        destination_address: r.destination_address,
        departure_time: r.departure_time,
      },
    }));
  }

  static async changeStatus(bookingId: number, userId: number, newStatus: NewStatus) {
    if(!Number.isFinite(bookingId) || !Number.isFinite(userId)) {
      throw new Error("Reserva ID ou user ID inválido");
    }

    return await db.transaction(async (trx) => {
      const booking = await trx("bookings").where("id", bookingId).first();
      if (!booking) throw new Error("Reserva não localizada");
    
      const ride = await trx("rides").where("id", booking.ride_id).first();
      if (!ride) throw new Error("Corrida não localizada");

      const prevStatus: NewStatus = booking.status;

      if (newStatus === "CONFIRMED" || newStatus === "REJECTED"){
        if (ride.drive_id !== userId) throw new Error("Apenas motorista consegue confirmar/rejeitar reservas");
      } else if (newStatus === "CANCELLED"){
        if (booking.passenger_id !== userId) throw new Error("Apenas passageiro consegue cancelar reservas");
      }
    })
  }
  
}