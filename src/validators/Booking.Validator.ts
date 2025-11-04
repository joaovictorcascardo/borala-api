import { z } from "zod";

export const createBooking = z.object({
  vehicle_id: z
    .number({ message: "O ID do veículo deve ser um número." }),
  body: z.object({
    seats_booked: z
      .number({ message: "O número de assentos deve ser um número." })
      .int({ message: "O número de assentos deve ser um inteiro." })
      .min(1, { message: "É necessário reservar pelo menos 1 assento." }),
  }),
});

export const updateBooking = z.object({
  body: z.object({
    status: z
      .enum(["CONFIRMED", "REJECTED", "CANCELLED"], {
        message: "Status inválido.",
      }),
  }),
});
