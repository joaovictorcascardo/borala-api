import BookingService from "../../src/services/Booking.Service";
import { BookingData } from "../../src/data/Booking.Data";
import { RideData } from "../../src/data/Ride.Data";

jest.mock("../../src/data/Booking.Data");
jest.mock("../../src/data/Ride.Data");
jest.mock("../../src/database/connection", () => ({
  db: {
    transaction: (cb: any) =>
      cb({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        returning: jest
          .fn()
          .mockResolvedValue([{ id: 1, status: "CONFIRMED" }]),
      }),
    fn: { now: () => new Date() },
  },
}));

describe("Booking Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const mockRide = {
      id: 1,
      driver_id: 100,
      available_seats: 4,
      status: "SCHEDULED",
      automatic_approval: false,
    };

    it("deve criar uma reserva pendente com sucesso", async () => {
      (RideData.prototype.findById as jest.Mock).mockResolvedValue(mockRide);
      (
        BookingData.prototype.findByRideAndPassenger as jest.Mock
      ).mockResolvedValue(null);
      (BookingData.prototype.create as jest.Mock).mockResolvedValue({
        id: 1,
        status: "PENDING",
      });

      const result = await BookingService.create(1, 200, 2);

      expect(result.status).toBe("PENDING");
      expect(BookingData.prototype.create).toHaveBeenCalledWith(
        1,
        200,
        2,
        "PENDING"
      );
    });

    it("deve lançar erro se o motorista tentar reservar a própria carona", async () => {
      (RideData.prototype.findById as jest.Mock).mockResolvedValue(mockRide);

      await expect(BookingService.create(1, 100, 1)).rejects.toThrow(
        "O motorista não pode reservar sua própria viagem."
      );
    });

    it("deve lançar erro se não houver assentos suficientes", async () => {
      (RideData.prototype.findById as jest.Mock).mockResolvedValue(mockRide);

      await expect(BookingService.create(1, 200, 5)).rejects.toThrow(
        "Número de assentos solicitados excede os disponíveis."
      );
    });
  });
});
