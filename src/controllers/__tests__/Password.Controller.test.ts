import request from "supertest";
import { app } from "../../app";
import { db } from "../../database/connection";
import crypto from "crypto";

describe("Password Controller", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE users, events CASCADE");
  });

  describe("POST /reset-password", () => {
    it("deve redefinir a senha com um token válido", async () => {
      const userData = { name: "Usuário", email: "reset@teste.com", password: "senhaantiga", birth_date: "2000-01-01", phone: 123 };
      await request(app).post("/users").send(userData);

      const rawToken = "meu-token-secreto-reset";
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      await db("users")
        .where({ email: userData.email })
        .update({
          password_reset_token: tokenHash,
          password_reset_expires: expires
        });

      const response = await request(app)
        .post("/authenticator/reset-password")
        .send({
          token: rawToken,
          password: "senhanova123",
          password_confirmation: "senhanova123"
        });

      expect(response.status).toBe(204);

      const loginRes = await request(app).post("/authenticator/sessions").send({
        email: userData.email,
        password: "senhanova123"
      });
      expect(loginRes.status).toBe(200);
    });
  });
});