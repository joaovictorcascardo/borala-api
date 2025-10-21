import { z } from "zod";

const createUser = z.object({
    body: z.object({
        name: z.string({message: "Precisa ser letras"}).min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
        email: z.string().email({ message: 'Formato de e-mail inválido.' }),
        password: z.string().min(6, { message: 'A senha precisa ter no mínimo 6 caracteres.' }),
        birth_date: z.string().transform((date) => new Date(date)),
        phone: z.number().int().positive().nullable(),
        //Vamos precisar de um regex para o telefone
    })
});

export const UserValidator = {
  createUser,
};
