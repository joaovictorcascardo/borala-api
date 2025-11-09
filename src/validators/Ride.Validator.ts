import { z } from "zod";

const createRide = z.object({
  body: z.object({
    vehicle_id: z
      .number({ message: "O ID do veículo deve ser um número." })
      .int({ message: "O ID do veículo deve ser um número inteiro." })
      .positive({ message: "O ID do veículo deve ser positivo." }),

    event_id: z.number().int().positive().nullable().optional(),

    origin_address: z
      .string()
      .min(5, { message: "Endereço de origem muito curto (mínimo 5)." })
      .max(255, { message: "Endereço de origem muito longo (máximo 255)." }),

    origin_latitude: z.number().min(-90).max(90),

    origin_longitude: z.number().min(-180).max(180),

    destination_address: z
      .string()
      .min(5, { message: "Endereço de destino muito curto (mínimo 5)." })
      .max(255, { message: "Endereço de destino muito longo (máximo 255)." }),

    destination_latitude: z.number().min(-90).max(90),

    destination_longitude: z.number().min(-180).max(180),

    departure_time: z.string().transform((date) => new Date(date)),

    available_seats: z
      .number()
      .int({ message: "Número de assentos deve ser inteiro." })
      .positive({ message: "Número de assentos deve ser positivo." })
      .min(1, { message: "Deve haver pelo menos 1 assento disponível." }),

    estimated_total_cost: z
      .number({ message: "Custo estimado deve ser um número." })
      .positive({ message: "Custo estimado deve ser positivo." })
      .nullable()
      .optional(),

    additional_info: z
      .string()
      .min(20, { message: "Informações adicionais muito curtas (min 20)." })
      .max(500, { message: "Informações adicionais muito longas (máx 500)." })
      .nullable()
      .optional(),

    automatic_approval: z
      .boolean({ message: "Aprovação automática deve ser um booleano." })
      .optional(),
  }),
});

export const RideValidator = {
  createRide,
};
