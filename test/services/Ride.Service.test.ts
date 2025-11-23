import RideService from "../../src/services/Ride.Service";
import { RideData } from "../../src/data/Ride.Data";
import { VehicleData } from "../../src/data/Vehicle.Data";

jest.mock("../../src/data/Ride.Data");
jest.mock("../../src/data/Vehicle.Data");

describe("Ride Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const rideDTO = {
      vehicle_id: 1,
      origin_address: "Origem",
      origin_latitude: 0,
      origin_longitude: 0,
      destination_address: "Destino",
      destination_latitude: 0,
      destination_longitude: 0,
      departure_time: new Date(),
      available_seats: 3,
    };

    it("deve criar carona se o veículo pertencer ao motorista", async () => {
      (VehicleData.prototype.findByIdAndUserId as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: 100,
      });
      (RideData.prototype.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...rideDTO,
      });

      const result = await RideService.create(100, rideDTO);

      expect(result).toBeDefined();
      expect(RideData.prototype.create).toHaveBeenCalledWith(100, rideDTO);
    });

    it("deve lançar erro se o veículo não for encontrado ou não pertencer ao motorista", async () => {
      (VehicleData.prototype.findByIdAndUserId as jest.Mock).mockResolvedValue(
        null
      );

      await expect(RideService.create(100, rideDTO)).rejects.toThrow(
        "Veículo não encontrado ou não pertence ao motorista."
      );

      expect(RideData.prototype.create).not.toHaveBeenCalled();
    });
  });
});
