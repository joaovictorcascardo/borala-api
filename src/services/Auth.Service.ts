import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from 'ms';
import crypto from "crypto";
import { LoginDTO } from "../dto/AuthDTO";
import { ResetPasswordDTO } from "../dto/AuthDTO";
import { UserData } from "../data/User.Data"

class AuthService {
  userData = new UserData();
  public async login({ email, password }: LoginDTO) {
    const user = await this.userData.login(email, password);
    const secret = process.env.JWT_SECRET;
    const expire: StringValue = process.env.JWT_EXPIRES_IN as StringValue ;
    if (!secret || !expire) {
      throw new Error("JWT_SECRET ou JWT_EXPIRES_IN não definidos nas variáveis de ambiente.");
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, secret as string, { expiresIn: expire });
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: token };
  }
  public async forgotPassword(email: string): Promise<void> {
    const userId = await this.userData.verifyUser(email);
    const resetToken = crypto.randomBytes(32).toString("hex"); 
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    await this.userData.updateResetToken(userId, tokenHash, expires);
    console.log( "Reset Token: ",resetToken);
  }
  public async resetPassword({
    token,
    password,
  }: ResetPasswordDTO): Promise<void> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const userId = await this.userData.validateResetPassword(tokenHash);
    const newPasswordHash = await bcrypt.hash(password, 10);
    await this.userData.resetPassword(userId, newPasswordHash);
  }
}
export default new AuthService();
