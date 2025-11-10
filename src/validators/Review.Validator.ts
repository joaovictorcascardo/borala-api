import { z } from "zod";

export const createReview = z.object({
    body: z.object({
        rating: z
            .number({ message: "A avaliação é dada por numeros" })
            .min(1, { message: "A nota mínima é 1." })
            .max(5, { message: "A nota máxima é 5." }),
        comment: z 
            .string({message: "Este campo deve ser preenchido com um texto."}),
        reviewee_id: z
            .coerce.number({ message: "O ID é obrigatório no parâmetro da URL e deve ser um número." })
            .int({ message: "O ID deve ser um número inteiro." })
            .positive({ message: "O ID deve ser um número positivo." })
    }),
    params: z.object({
        rideId: z
            .coerce.number({ message: "O ID é obrigatório no parâmetro da URL e deve ser um número." })
            .int({ message: "O ID deve ser um número inteiro." })
            .positive({ message: "O ID deve ser um número positivo." })
    })
})