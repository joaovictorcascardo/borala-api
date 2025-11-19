import UserService from "../User.Service";
import { UserData } from "../../data/User.Data";
import bcrypt from "bcryptjs";

jest.mock("../../data/User.Data");
jest.mock("bcryptjs");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar hash da senha e criar usuário se o email for único", async () => {
      const userData = {
        name: "Usuário Unitário",
        email: "unitario@teste.com",
        password: "senhacomum",
        birth_date: new Date(),
        phone: "123456789",
      };

      (UserData.prototype.existingUser as jest.Mock).mockResolvedValue(false);
      (bcrypt.hash as jest.Mock).mockResolvedValue("senha_hash");
      (UserData.prototype.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        role: "USER",
      });

      const result = await UserService.create(userData);

      expect(UserData.prototype.existingUser).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(UserData.prototype.createUser).toHaveBeenCalledWith(
        userData.name,
        userData.email,
        "senha_hash",
        userData.birth_date,
        userData.phone
      );
      expect(result).toHaveProperty("id", 1);
    });

    it("deve lançar erro se o email já existir", async () => {
      const userData = {
        name: "Usuário Duplicado",
        email: "existe@teste.com",
        password: "123",
        birth_date: new Date(),
      };

      (UserData.prototype.existingUser as jest.Mock).mockResolvedValue(1);

      await expect(UserService.create(userData))
        .rejects
        .toThrow("Este e-mail já está em uso.");

      expect(UserData.prototype.createUser).not.toHaveBeenCalled();
    });
  });
});