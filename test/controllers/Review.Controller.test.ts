import request from "supertest";
import { app } from "../../src/app";
import { db } from "../../src/database/connection";

describe("Review Controller", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE users, events CASCADE");
  });

  describe("POST /rides/:rideId/reviews", () => {
    it("deve criar uma avaliação com sucesso", async () => {
      // CORRIGIDO: Senhas "123456"
      const driverRes = await request(app).post("/users").send({
        name: "Motorista",
        email: "d@t.com",
        password: "123456",
        birth_date: "2000-01-01",
        phone: 111,
      });
      const driverLogin = await request(app)
        .post("/authenticator/sessions")
        .send({ email: "d@t.com", password: "123456" });
      const driverToken = driverLogin.body.token;
      const driverId = driverLogin.body.user.id;

      const passRes = await request(app).post("/users").send({
        name: "Passageiro",
        email: "p@t.com",
        password: "123456",
        birth_date: "2000-01-01",
        phone: 222,
      });
      const passLogin = await request(app)
        .post("/authenticator/sessions")
        .send({ email: "p@t.com", password: "123456" });
      const passToken = passLogin.body.token;

      const vehicleRes = await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${driverToken}`)
        .send({
          brand: "Vw",
          model: "Gol",
          color: "Azul",
          license_plate: "HHH1234",
          year: 2015,
          seats: 4,
        });

      const rideRes = await request(app)
        .post("/rides")
        .set("Authorization", `Bearer ${driverToken}`)
        .send({
          vehicle_id: Number(vehicleRes.body.id), // Convertendo para número
          origin_address: "Origem X",
          origin_latitude: 0,
          origin_longitude: 0,
          destination_address: "Destino Y",
          destination_latitude: 0,
          destination_longitude: 0,
          departure_time: new Date().toISOString(),
          available_seats: 3,
          automatic_approval: true,
        });
      const rideId = rideRes.body.id;

      // Simular que a carona foi completada para permitir avaliação
      await db("rides").where({ id: rideId }).update({ status: "COMPLETED" });
      // Simular que o passageiro participou (booking confirmado)
      await db("bookings").insert({
        ride_id: rideId,
        passenger_id: passLogin.body.user.id,
        status: "CONFIRMED",
      });

      const response = await request(app)
        .post(`/rides/${rideId}/reviews`)
        .set("Authorization", `Bearer ${passToken}`)
        .send({
          reviewee_id: driverId,
          rating: 5,
          comment: "Ótima viagem!",
        });

      expect(response.status).toBe(201);
      expect(response.body.comment).toBe("Ótima viagem!");
    });
  });
});
