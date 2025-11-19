import request from "supertest";
import { app } from "../../app";
import { db } from "../../database/connection";

describe("Vehicle Controller", () => {
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
    name: "Dono Veículo",
    email: "dono@teste.com",
    password: "senha123",
    birth_date: "1990-01-01",
    phone: 11999998888,
  };

  const vehicleData = {
    brand: "Toyota",
    model: "Corolla",
    color: "Preto",
    license_plate: "ABC1234",
    year: 2020,
    seats: 4,
  };

  let token: string;

  const loginUser = async () => {
    await request(app).post("/users").send(userData);
    const res = await request(app).post("/authenticator/sessions").send({
      email: userData.email,
      password: userData.password,
    });
    return res.body.token;
  };

  describe("POST /vehicles", () => {
    it("deve criar um veículo com sucesso", async () => {
      token = await loginUser();

      const response = await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send(vehicleData);

      expect(response.status).toBe(201);
      expect(response.body.license_plate).toBe(vehicleData.license_plate);
      expect(response.body.model).toBe(vehicleData.model);
    });

    it("deve retornar 409 se a placa já estiver cadastrada", async () => {
      token = await loginUser();

      await request(app).post("/vehicles").set("Authorization", `Bearer ${token}`).send(vehicleData);
      const response = await request(app).post("/vehicles").set("Authorization", `Bearer ${token}`).send(vehicleData);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Veículo com esta placa já cadastrado.");
    });

    it("deve retornar 400 se a validação falhar", async () => {
      token = await loginUser();
      const invalidVehicle = { ...vehicleData, year: 1800 };

      const response = await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidVehicle);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /vehicles", () => {
    it("deve listar os veículos do usuário logado", async () => {
      token = await loginUser();
      await request(app).post("/vehicles").set("Authorization", `Bearer ${token}`).send(vehicleData);

      const response = await request(app)
        .get("/vehicles")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].license_plate).toBe(vehicleData.license_plate);
    });
  });
});