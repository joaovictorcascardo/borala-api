import request from "supertest";
import { app } from "../../app";
import { db } from "../../database/connection";

describe("Ride Controller", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE users, events CASCADE");
  });

  const driverData = {
    name: "Motorista",
    email: "motorista@teste.com",
    password: "senha123",
    birth_date: "1990-01-01",
    phone: 11999998888,
  };

  const vehicleData = {
    brand: "Honda",
    model: "Civic",
    color: "Prata",
    license_plate: "XYZ9876",
    year: 2021,
    seats: 4,
  };

  describe("POST /rides", () => {
    it("deve criar uma carona com sucesso", async () => {
      await request(app).post("/users").send(driverData);
      const loginRes = await request(app).post("/authenticator/sessions").send({
        email: driverData.email,
        password: driverData.password,
      });
      const token = loginRes.body.token;

      const vehicleRes = await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send(vehicleData);
      const vehicleId = vehicleRes.body.id;

      const rideData = {
        vehicle_id: vehicleId,
        origin_address: "Rua A, 123",
        origin_latitude: -23.55052,
        origin_longitude: -46.633308,
        destination_address: "Rua B, 456",
        destination_latitude: -22.906847,
        destination_longitude: -43.1729,
        departure_time: new Date().toISOString(),
        available_seats: 3,
        estimated_total_cost: 50.00,
        automatic_approval: true
      };

      const response = await request(app)
        .post("/rides")
        .set("Authorization", `Bearer ${token}`)
        .send(rideData);

      expect(response.status).toBe(201);
      expect(response.body.origin_address).toBe(rideData.origin_address);
      expect(response.body.driver_id).toBeDefined();
    });

    it("deve retornar 400 se o veículo não pertencer ao motorista", async () => {
       await request(app).post("/users").send(driverData);
       const loginRes1 = await request(app).post("/authenticator/sessions").send({
         email: driverData.email, password: driverData.password
       });
       const token1 = loginRes1.body.token;

       const vehicleRes = await request(app).post("/vehicles").set("Authorization", `Bearer ${token1}`).send(vehicleData);
       const vehicleId = vehicleRes.body.id;

       const intruderData = { ...driverData, email: "intruso@teste.com" };
       await request(app).post("/users").send(intruderData);
       const loginRes2 = await request(app).post("/authenticator/sessions").send({
         email: intruderData.email, password: intruderData.password
       });
       const token2 = loginRes2.body.token;

       const rideData = {
         vehicle_id: vehicleId,
         origin_address: "Rua A",
         origin_latitude: 0, origin_longitude: 0,
         destination_address: "Rua B",
         destination_latitude: 0, destination_longitude: 0,
         departure_time: new Date().toISOString(),
         available_seats: 3
       };

       const response = await request(app)
         .post("/rides")
         .set("Authorization", `Bearer ${token2}`)
         .send(rideData);

       expect(response.status).toBe(400);
       expect(response.body.error).toBe("Veículo não encontrado ou não pertence ao motorista.");
    });
  });
});