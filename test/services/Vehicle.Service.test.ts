import VehicleService from "../../src/services/Vehicle.Service";
import { VehicleData } from "../../src/data/Vehicle.Data";

jest.mock("../../src/data/Vehicle.Data");

describe("Vehicle Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar veículo se a placa for única", async () => {
      const vehicleDTO = {
        brand: "Ford",
        model: "Ka",
        color: "Vermelho",
        license_plate: "ABC1234",
        year: 2020,
        seats: 4,
        userId: 1,
      };

      (VehicleData.prototype.findByLicensePlate as jest.Mock).mockResolvedValue(
        null
      );
      (VehicleData.prototype.createVehicle as jest.Mock).mockResolvedValue({
        id: 1,
        ...vehicleDTO,
      });

      const result = await VehicleService.create(vehicleDTO);

      expect(result).toHaveProperty("id", 1);
    });

    it("deve lançar erro se a placa já existir", async () => {
      (VehicleData.prototype.findByLicensePlate as jest.Mock).mockResolvedValue(
        { id: 5 }
      );

      await expect(VehicleService.create({} as any)).rejects.toThrow(
        "Veículo com esta placa já cadastrado."
      );
    });
  });

  describe("update", () => {
    it("deve atualizar veículo se o usuário for o dono", async () => {
      (VehicleData.prototype.findById as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: 100,
      });
      (VehicleData.prototype.update as jest.Mock).mockResolvedValue({
        id: 1,
        color: "Azul",
      });

      const result = await VehicleService.update(1, 100, { color: "Azul" });

      expect(result.color).toBe("Azul");
    });

    it("deve lançar erro se o usuário não for o dono", async () => {
      (VehicleData.prototype.findById as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: 100,
      });

      await expect(
        VehicleService.update(1, 999, { color: "Azul" })
      ).rejects.toThrow(
        "Operação não permitida. Este veículo não pertence a você."
      );
    });
  });
});
