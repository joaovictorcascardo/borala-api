import { z } from "zod";

export const createSession = z.object({
  
    body: z.object({
        email: z.email({ 
            message: "Formato de e-mail inválido." 
        })
        .min(1, { 
            message: "O e-mail é obrigatório." 
        }),

        password: z.string({
            message: "A senha é obrigatória."
        })
        .min(1, { 
            message: "A senha é obrigatória." 
        })
    })
});