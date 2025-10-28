import { db } from "../database/connection";

type NewStatus = "CONFIRMADO" | "REJEITADO" | "CANCELADO" | "PENDENTE";

export default class BookingService {
    static async create (rideId: Number, passengerId: number, seatsBooked: number) {
        if (!Number.isFinite(rideId) || !Number.isFinite(passengerId)){
            throw new Error("rideId ou passengerId inválidos.");
        }
        if (!Number.isFinite(seatsBooked) || seatsBooked < 1) {
            throw new Error("seats_booked inválidos.");
        }

        return await db.transaction(async (trx) => {
            const ride = await trx("corridas").where("id",rideId).first();
            if (!ride) throw new Error("Corrida inválida.");
        })
    }
}