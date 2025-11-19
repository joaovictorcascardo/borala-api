import request from "supertest";
import { app } from "../../app";
import { db } from "../../database/connection";

describe("E2E: Fluxo Completo de Carona", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE users, events CASCADE");
  });

  it("deve permitir o fluxo completo: Motorista cria carona -> Passageiro reserva -> Motorista confirma -> Passageiro avalia", async () => {
    const motoristaUser = {
      name: "Motorista João",
      email: "joao@motorista.com",
      password: "123",
      birth_date: "1990-01-01",
      phone: 11999991111,
    };

    await request(app).post("/users").send(motoristaUser).expect(201);

    const loginMotorista = await request(app).post("/authenticator/sessions").send({
      email: motoristaUser.email,
      password: motoristaUser.password,
    }).expect(200);
    
    const tokenMotorista = loginMotorista.body.token;
    const idMotorista = loginMotorista.body.user.id;

    const veiculoRes = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${tokenMotorista}`)
      .send({
        brand: "Ford",
        model: "Ka",
        color: "Vermelho",
        license_plate: "E2E1234",
        year: 2022,
        seats: 4,
      })
      .expect(201);
    
    const idVeiculo = veiculoRes.body.id;

    const caronaRes = await request(app)
      .post("/rides")
      .set("Authorization", `Bearer ${tokenMotorista}`)
      .send({
        vehicle_id: idVeiculo,
        origin_address: "São Paulo",
        origin_latitude: -23.55,
        origin_longitude: -46.63,
        destination_address: "Rio de Janeiro",
        destination_latitude: -22.90,
        destination_longitude: -43.17,
        departure_time: new Date().toISOString(),
        available_seats: 3,
        automatic_approval: false,
      })
      .expect(201);
    
    const idCarona = caronaRes.body.id;

    const passageiroUser = {
      name: "Passageira Maria",
      email: "maria@passageira.com",
      password: "123",
      birth_date: "1995-05-05",
      phone: 11999992222,
    };

    await request(app).post("/users").send(passageiroUser).expect(201);

    const loginPassageiro = await request(app).post("/authenticator/sessions").send({
      email: passageiroUser.email,
      password: passageiroUser.password,
    }).expect(200);

    const tokenPassageiro = loginPassageiro.body.token;

    const reservaRes = await request(app)
      .post(`/rides/${idCarona}/bookings`)
      .set("Authorization", `Bearer ${tokenPassageiro}`)
      .send({ seats_booked: 1 })
      .expect(201);
    
    const idReserva = reservaRes.body.id;
    expect(reservaRes.body.status).toBe("PENDING");

    const confirmacaoRes = await request(app)
      .patch(`/bookings/${idReserva}`)
      .set("Authorization", `Bearer ${tokenMotorista}`)
      .send({ status: "CONFIRMED" })
      .expect(200);
    
    expect(confirmacaoRes.body.status).toBe("CONFIRMED");

    const avaliacaoRes = await request(app)
      .post(`/rides/${idCarona}/reviews`)
      .set("Authorization", `Bearer ${tokenPassageiro}`)
      .send({
        reviewee_id: idMotorista,
        rating: 5,
        comment: "Ótima viagem! Motorista seguro.",
      })
      .expect(201);
    
    expect(avaliacaoRes.body.rating).toBe(5);
  });
});