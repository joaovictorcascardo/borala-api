import { z } from "zod";

export const createBooking = z.object({
    body: z.object({
        seats_booked: z.number({
            invalid_type_error: "O número d assentos deve ser um número.",
        })
        .int(("O número de asssentos "))
        .min(1, "É necessario reservar pelo menos 1 assento"),
    }),
});

export const updateBooking = z.object({
    body: z.object({
        srarys: z.enum(["CONFIRMADO", "REJEITADO", "CANCELADO"], {
            errorMap: () => ({ message: "status inválido"})
        })
    }),
});