import request from "supertest";
import { app } from "../../app";
import { db } from "../../database/connection";

describe("Session Controller", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE users, events CASCADE");
  });

  const userData = {
    name: "Usuário Sessão",
    email: "sessao@teste.com",
    password: "senha123",
    birth_date: "1990-01-01",
    phone: 11999998888,
  };

  describe("POST /authenticator/sessions", () => {
    it("deve autenticar o usuário com credenciais válidas", async () => {
      await request(app).post("/users").send(userData);

      const response = await request(app).post("/authenticator/sessions").send({
        email: userData.email,
        password: userData.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty("password_hash");
    });

    it("deve retornar 401 com senha inválida", async () => {
      await request(app).post("/users").send(userData);

      const response = await request(app).post("/authenticator/sessions").send({
        email: userData.email,
        password: "senhaincorreta",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    it("deve retornar 401 com email inexistente", async () => {
      const response = await request(app).post("/authenticator/sessions").send({
        email: "inexistente@teste.com",
        password: "qualquersenha",
      });

      expect(response.status).toBe(401);
    });
  });
});