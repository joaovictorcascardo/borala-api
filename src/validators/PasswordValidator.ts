import { z } from "zod";

export const forgotPassword = z.object({
    body: z.object({
        email: z.email({ 
            message: "Formato de e-mail inválido."
        })
        .min(1, {
            message: "O e-mail é obrigatório."
        }),   
    })
})

export const resetPassword = z.object({
    body: z.object({
        token: z.string({
          message: "O token deve ser do tipo string."
        })
        .min(1, {
          message: "O token é obrigatório."
        }),
    
        password: z.string({
          message: "A senha deve ser do tipo string."
        })
        .min(6, {
          message: "A senha deve ter no mínimo 6 caracteres."
        }),
    
        password_confirmation: z.string({
          message: "A confirmação da senha deve ser do tipo string."
        })
    })
    .refine((data) => data.password === data.password_confirmation, {
          message: "As senhas não conferem.",
          path: ["password_confirmation"], 
        }
    )
    
})
