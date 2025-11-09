import { z } from "zod";
const createVehicle = z.object({
  body: z.object({
    brand: z
      .string()
      .min(2, { message: "A marca deve ter no mínimo 2 caracteres." }),

    model: z
      .string()
      .min(1, { message: "O modelo deve ter no mínimo 1 caractere." }),

    color: z
      .string()
      .min(3, { message: "A cor deve ter no mínimo 3 caracteres." }),

    license_plate: z
      .string()
      .regex(/^[A-Z0-9]{7}$/i, {
        message: "Formato de placa inválido (7 caracteres alfanuméricos).",
      })
      .transform((plate) => plate.toUpperCase()),

    year: z
      .number()
      .int({ message: "O ano deve ser um número inteiro." })
      .min(1990, { message: "Ano inválido (mínimo 1990)." })
      .max(new Date().getFullYear() + 1, {
        message: "Ano inválido (máximo próximo ano).",
      }),

    seats: z
      .number()
      .int({ message: "O número de assentos deve ser inteiro." })
      .positive({ message: "O número de assentos deve ser positivo." })
      .min(2, { message: "O veículo deve ter pelo menos 2 assentos." }),
  }),
});

const updateVehicle = z.object({
  params: z.object({
    id: z.coerce
      .number({
        message: "O ID do veículo (parâmetro) deve ser um número.",
      })
      .int()
      .positive("O ID do veículo deve ser um número positivo."),
  }),
  body: z.object({
    brand: z
      .string()
      .min(2, { message: "A marca deve ter no mínimo 2 caracteres." })
      .optional(),

    model: z
      .string()
      .min(1, { message: "O modelo deve ter no mínimo 1 caractere." })
      .optional(),

    color: z
      .string()
      .min(3, { message: "A cor deve ter no mínimo 3 caracteres." })
      .optional(),

    year: z
      .number()
      .int({ message: "O ano deve ser um número inteiro." })
      .min(1990, { message: "Ano inválido (mínimo 1990)." })
      .max(new Date().getFullYear() + 1, {
        message: "Ano inválido (máximo próximo ano).",
      })
      .optional(),

    seats: z
      .number()
      .int({ message: "O número de assentos deve ser inteiro." })
      .positive({ message: "O número de assentos deve ser positivo." })
      .min(2, { message: "O veículo deve ter pelo menos 2 assentos." })
      .optional(),
  }),
});

const deleteVehicle = z.object({
  params: z.object({
    id: z.coerce
      .number({
        message: "O ID do veículo (parâmetro) deve ser um número.",
      })
      .int()
      .positive("O ID do veículo deve ser um número positivo."),
  }),
});

export const VehicleValidator = {
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
