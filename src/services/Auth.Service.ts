import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from 'ms';
import crypto from "crypto";
import { LoginDTO } from "../dto/AuthDTO";
import { ResetPasswordDTO } from "../dto/AuthDTO";
import { UserData } from "../data/User.Data";
import { sendPasswordResetEmail } from "./Mailer.Service";

class AuthService {
  userData = new UserData();
  async login({ email, password }: LoginDTO) {
    try{
      const user = await this.userData.login(email);
      if (!user || !(await bcrypt.compare(password, user.password_hash))){
        throw new Error("E-mail ou senha inválidos.");
      }
      const secret = process.env.JWT_SECRET;
      const expire: StringValue = process.env.JWT_EXPIRES_IN as StringValue;
      if (!secret || !expire) {
        throw new Error("JWT_SECRET ou JWT_EXPIRES_IN não definidos nas variáveis de ambiente.");
      }
      const token = jwt.sign({ userId: user.id, role: user.role }, secret as string, { expiresIn: expire });
      const { password_hash, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token: token };
    }catch(error:any){
      throw new Error(error.message);   
    }
  }
  async forgotPassword(email: string): Promise<void> {
    try{
      const userId = await this.userData.existingUser(email);
      if (userId == false){
        throw new Error("Nenhum usuário com este email.");
      }
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);
      await this.userData.updateResetToken(userId as number, tokenHash, expires);
      await sendPasswordResetEmail(email, resetToken);
    }catch(error:any){
      throw new Error(error.message);    
    }

  }
  async resetPassword({
    token,
    password,
  }: ResetPasswordDTO): Promise<void> {
    try{
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const userId = await this.userData.validateResetPassword(tokenHash);
      if(!userId){
        throw new Error("Token inválido ou expirado.");
      }
      const newPasswordHash = await bcrypt.hash(password, 10);
      await this.userData.resetPassword(userId, newPasswordHash);
    }catch(error:any){
      throw new Error(error.message);    
    }

  }
}
export default new AuthService();
