import request from "supertest";
import { app } from "../../app";
import { db } from "../../database/connection";

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
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    birth_date: "2000-01-01",
    phone: 11999998888,
  };

  it("deve criar um novo usuário com sucesso", async () => {
    const response = await request(app).post("/users").send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty("password_hash");
  });

  it("deve retornar 409 (Conflict) ao tentar criar usuário com email duplicado", async () => {
    await request(app).post("/users").send(userData);
    const response = await request(app).post("/users").send(userData);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Este e-mail já está em uso.");
  });
});
