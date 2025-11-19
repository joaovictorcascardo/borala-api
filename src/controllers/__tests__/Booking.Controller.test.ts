import request from "supertest";
import { app } from "../../app";
import { db } from "../../database/connection";

describe("Booking Controller", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE users, events CASCADE");
  });

  const setupScenario = async () => {
    const driverRes = await request(app).post("/users").send({ name: "Motorista", email: "mot@t.com", password: "123", birth_date: "2000-01-01", phone: 111 });
    const driverLogin = await request(app).post("/authenticator/sessions").send({ email: "mot@t.com", password: "123" });
    const driverToken = driverLogin.body.token;

    const vehicleRes = await request(app).post("/vehicles").set("Authorization", `Bearer ${driverToken}`).send({ brand: "Fiat", model: "Uno", color: "Branco", license_plate: "AAA1111", year: 2010, seats: 4 });
    
    const rideRes = await request(app).post("/rides").set("Authorization", `Bearer ${driverToken}`).send({
      vehicle_id: vehicleRes.body.id,
      origin_address: "A", origin_latitude: 0, origin_longitude: 0,
      destination_address: "B", destination_latitude: 0, destination_longitude: 0,
      departure_time: new Date().toISOString(),
      available_seats: 3,
      automatic_approval: false
    });

    const passengerRes = await request(app).post("/users").send({ name: "Passageiro", email: "pass@t.com", password: "123", birth_date: "2000-01-01", phone: 222 });
    const passengerLogin = await request(app).post("/authenticator/sessions").send({ email: "pass@t.com", password: "123" });
    const passengerToken = passengerLogin.body.token;

    return { driverToken, passengerToken, rideId: rideRes.body.id };
  };

  describe("POST /rides/:rideId/bookings", () => {
    it("deve criar uma reserva com sucesso", async () => {
      const { passengerToken, rideId } = await setupScenario();

      const response = await request(app)
        .post(`/rides/${rideId}/bookings`)
        .set("Authorization", `Bearer ${passengerToken}`)
        .send({ seats_booked: 1 });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("PENDING");
    });

    it("deve falhar se o motorista tentar reservar a própria viagem", async () => {
      const { driverToken, rideId } = await setupScenario();

      const response = await request(app)
        .post(`/rides/${rideId}/bookings`)
        .set("Authorization", `Bearer ${driverToken}`)
        .send({ seats_booked: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("não pode reservar sua própria viagem");
    });
  });

  describe("PATCH /bookings/:id", () => {
     it("deve permitir que o motorista confirme a reserva", async () => {
         const { driverToken, passengerToken, rideId } = await setupScenario();
         
         const bookingRes = await request(app)
            .post(`/rides/${rideId}/bookings`)
            .set("Authorization", `Bearer ${passengerToken}`)
            .send({ seats_booked: 1 });
         const bookingId = bookingRes.body.id;

         const response = await request(app)
            .patch(`/bookings/${bookingId}`)
            .set("Authorization", `Bearer ${driverToken}`)
            .send({ status: "CONFIRMED" });

         expect(response.status).toBe(200);
         expect(response.body.status).toBe("CONFIRMED");
     });
  });
});