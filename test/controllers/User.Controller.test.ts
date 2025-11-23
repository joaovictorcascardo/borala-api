import request from "supertest";
import { app } from "../../src/app";
import { db } from "../../src/database/connection";

describe("User Controller", () => {
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
    name: "Usuário Teste",
    email: "teste@exemplo.com",
    password: "senha123",
    birth_date: "2000-01-01",
    phone: 11999998888,
  };

  describe("POST /users", () => {
    it("deve criar um novo usuário com sucesso", async () => {
      const response = await request(app).post("/users").send(userData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty("password_hash");
    });

    it("deve retornar 409 se o email já estiver em uso", async () => {
      await request(app).post("/users").send(userData);
      const response = await request(app).post("/users").send(userData);
      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Este e-mail já está em uso.");
    });

    it("deve retornar 400 se o nome for muito curto", async () => {
      const invalidData = { ...userData, name: "Jo" };
      const response = await request(app).post("/users").send(invalidData);
      expect(response.status).toBe(400);
      const messages = response.body.map((err: any) => err.message);
      expect(messages).toContain("O nome precisa ter no mínimo 3 caracteres.");
    });

    it("deve retornar 400 se o email for inválido", async () => {
      const invalidData = { ...userData, email: "email-invalido" };
      const response = await request(app).post("/users").send(invalidData);
      expect(response.status).toBe(400);
      const messages = response.body.map((err: any) => err.message);
      expect(messages).toContain("Formato de e-mail inválido.");
    });

    it("deve retornar 400 se a senha for muito curta", async () => {
      const invalidData = { ...userData, password: "123" };
      const response = await request(app).post("/users").send(invalidData);
      expect(response.status).toBe(400);
      const messages = response.body.map((err: any) => err.message);
      expect(messages).toContain("A senha precisa ter no mínimo 6 caracteres.");
    });
  });

  describe("GET /users/me", () => {
    it("deve retornar o perfil do usuário logado", async () => {
      const userResponse = await request(app).post("/users").send(userData);
      const userId = userResponse.body.id;

      const loginResponse = await request(app)
        .post("/authenticator/sessions")
        .send({
          email: userData.email,
          password: userData.password,
        });
      const token = loginResponse.body.token;

      const response = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(userData.email);
    });

    it("deve retornar 401 se o token estiver ausente", async () => {
      const response = await request(app).get("/users/me");
      expect(response.status).toBe(401);
    });
  });

  describe("PUT /users/me", () => {
    it("deve atualizar o perfil do usuário logado", async () => {
      await request(app).post("/users").send(userData);
      const loginResponse = await request(app)
        .post("/authenticator/sessions")
        .send({
          email: userData.email,
          password: userData.password,
        });
      const token = loginResponse.body.token;

      const updateData = {
        name: "Nome Atualizado",
        bio: "Nova descrição bio",
        phone: 11888887777,
      };

      const response = await request(app)
        .put("/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.bio).toBe(updateData.bio);
    });
  });
});
