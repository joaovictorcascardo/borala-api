import AuthService from "../../src/services/Auth.Service";
import { UserData } from "../../src/data/User.Data";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

jest.mock("../../src/data/User.Data");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("crypto");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "segredo-teste";
    process.env.JWT_EXPIRES_IN = "1d";
  });

  describe("login", () => {
    it("deve retornar usuário e token com credenciais válidas", async () => {
      const mockUser = {
        id: 1,
        email: "teste@teste.com",
        password_hash: "senha_hash",
        role: "USER",
      };

      (UserData.prototype.login as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token_valido");

      const result = await AuthService.login({
        email: "teste@teste.com",
        password: "123",
      });

      expect(result).toHaveProperty("token", "token_valido");
      expect(result.user).not.toHaveProperty("password_hash");
    });

    it("deve lançar erro com email inválido", async () => {
      (UserData.prototype.login as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login({ email: "errado@teste.com", password: "123" })
      ).rejects.toThrow("E-mail ou senha inválidos.");
    });

    it("deve lançar erro com senha inválida", async () => {
      (UserData.prototype.login as jest.Mock).mockResolvedValue({
        password_hash: "hash",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login({ email: "teste@teste.com", password: "errada" })
      ).rejects.toThrow("E-mail ou senha inválidos.");
    });
  });

  describe("forgotPassword", () => {
    it("deve gerar token de reset se o email existir", async () => {
      (UserData.prototype.existingUser as jest.Mock).mockResolvedValue(1);

      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue("token_hash"),
      };
      (crypto.createHash as jest.Mock).mockReturnValue(mockHash);
      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: () => "token_bruto",
      });

      await AuthService.forgotPassword("teste@teste.com");

      expect(UserData.prototype.updateResetToken).toHaveBeenCalledWith(
        1,
        "token_hash",
        expect.any(Date)
      );
    });

    it("deve lançar erro se o email não for encontrado", async () => {
      (UserData.prototype.existingUser as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.forgotPassword("desconhecido@teste.com")
      ).rejects.toThrow("Nenhum usuário com este email.");
    });
  });
});
