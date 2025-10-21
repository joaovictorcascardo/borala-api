import { z } from "zod";

const createSessions = z.object({
  body: z.object({
    email: z.string().email({ message: "Formato de e-mail inválido." }),
    password: z
      .string()
      .min(6, { message: "A senha precisa ter no mínimo 6 caracteres." }),
  }),
});

export const SessionValidator = {
  createSessions,
};
