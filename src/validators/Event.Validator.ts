import { z } from "zod";

const createEvent = z.object({
    body: z.object({
        name: z
            .string({ message: "O nome é obrigatório." }),
        address: z
            .string({ message: "O endereço é obrigatório." }),
        latitude: z
            .coerce.number({ message: "A latitude é obrigatória." }),
        longitude: z
            .coerce.number({ message: "A longitude é obrigatória." }), 
        starts_at: z
            .coerce.date({ message: "A data de início é obrigatória."}),
        ends_at: z
            .coerce.date({ message: "A data de término é obrigatória." }), 
        description: z
            .string({ message: "A descrição é obrigatória." })
            .min(10, { message: "A descrição precisa conter ao menos 10 caracteres."})
    }),
});
const verifyId = z.object({
    params: z.object({
        id: z
            .coerce.number({ message: "O ID é obrigatório no parâmetro da URL e deve ser um número." })
            .int({ message: "O ID deve ser um número inteiro." })
            .positive({ message: "O ID deve ser um número positivo." })
    })
});
export const EventValidator = {
    createEvent, verifyId, 
};
