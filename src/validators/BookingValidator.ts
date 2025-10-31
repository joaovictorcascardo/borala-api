import { z } from "zod";

export const createBooking = z.object({
  body: z.object({
    seats_booked: z
      .number({ invalid_type_error: "O número de assentos deve ser um número." })
      .int({ message: "O número de assentos deve ser um inteiro." })
      .min(1, { message: "É necessário reservar pelo menos 1 assento." }),
  }),
});

export const updateBooking = z.object({
  body: z.object({
    status: z.enum(["CONFIRMED", "REJECTED", "CANCELLED"], {
      errorMap: () => ({ message: "Status inválido." }),
    }),
  }),
});