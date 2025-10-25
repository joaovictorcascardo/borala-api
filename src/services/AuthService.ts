import { db } from "../database/connection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface LoginDTO {
  email: string;
  password: string;
}
interface ResetPasswordDTO {
  token: string;
  password: string;
  password_confirmation: string;
}
class AuthService {
  public async login({ email, password }: LoginDTO) {
    const user = await db("users").where({ email }).first();
    if (!user) {
      throw new Error("E-mail ou senha inválidos.");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );
    if (!isPasswordCorrect) {
      throw new Error("E-mail ou senha inválidos.");
    }
    const secret = process.env.JWT_SECRET;

    const token = jwt.sign({ userId: user.id }, secret as string, {
      expiresIn: "1d",
    });
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: token };
  }
  public async forgotPassword(email: string): Promise<void> {
    const user = await db("users").where({ email }).first();
    if (!user) {
      throw new Error(
        ` O e-mail informado não possui cadastro no Borala: ${email}`
      );
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await db("users").where({ id: user.id }).update({
      password_reset_token: tokenHash,
      password_reset_expires: expires,
    });
  }
  public async resetPassword({
    token,
    password,
  }: ResetPasswordDTO): Promise<void> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db("users")
      .where({ password_reset_token: tokenHash })
      .andWhere("password_reset_expires", ">", new Date())
      .first();

    if (!user) {
      throw new Error("Token inválido ou expirado.");
    }

    const newPasswordHash = await bcrypt.hash(password, 10);

    await db("users").where({ id: user.id }).update({
      password_hash: newPasswordHash,
      password_reset_token: null,
      password_reset_expires: null,
    });
  }
}
export default new AuthService();
