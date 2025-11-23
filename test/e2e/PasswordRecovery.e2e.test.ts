import request from "supertest";
import { app } from "../../src/app";
import { db } from "../../src/database/connection";
import crypto from "crypto";

describe("E2E: Fluxo de Recuperação de Senha", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE users, events CASCADE");
  });

  it("deve permitir que o usuário redefina a senha e faça login com as novas credenciais", async () => {
    const dadosUsuario = {
      name: "Usuário Esquecido",
      email: "esqueci@teste.com",
      password: "senhaantiga123",
      birth_date: "2000-01-01",
      phone: 11999993333,
    };

    await request(app).post("/users").send(dadosUsuario).expect(201);

    await request(app)
      .post("/authenticator/forgot-password")
      .send({ email: dadosUsuario.email })
      .expect(204);

    const tokenBruto = "token-simulado-reset";
    const tokenHash = crypto
      .createHash("sha256")
      .update(tokenBruto)
      .digest("hex");
    const expiraEm = new Date();
    expiraEm.setHours(expiraEm.getHours() + 1);

    await db("users").where({ email: dadosUsuario.email }).update({
      password_reset_token: tokenHash,
      password_reset_expires: expiraEm,
    });

    const novaSenha = "senhanova123";

    await request(app)
      .post("/authenticator/reset-password")
      .send({
        token: tokenBruto,
        password: novaSenha,
        password_confirmation: novaSenha,
      })
      .expect(204);

    const loginRes = await request(app)
      .post("/authenticator/sessions")
      .send({
        email: dadosUsuario.email,
        password: novaSenha,
      })
      .expect(200);

    expect(loginRes.body).toHaveProperty("token");

    await request(app)
      .post("/authenticator/sessions")
      .send({
        email: dadosUsuario.email,
        password: dadosUsuario.password,
      })
      .expect(401);
  });
});
