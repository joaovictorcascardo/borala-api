import { z } from "zod";

export const createBooking = z.object({
  params: z.object({
    rideId: z.coerce
      .number({
        message: "O ID da carona (rideId) deve ser um número.",
      })
      .int()
      .positive(),
  }),
  body: z.object({
    seats_booked: z
      .number({ message: "O número de assentos deve ser um número." })
      .int({ message: "O número de assentos deve ser um inteiro." })
      .min(1, { message: "É necessário reservar pelo menos 1 assento." }),
  }),
});

export const updateBooking = z.object({
  params: z.object({
    id: z.coerce
      .number({
        message: "O ID da reserva (id) deve ser um número.",
      })
      .int()
      .positive(),
  }),
  body: z.object({
    status: z.enum(["CONFIRMED", "REJECTED", "CANCELLED"], {
      message: "Status inválido. (CONFIRMED, REJECTED, CANCELLED)",
    }),
  }),
});
