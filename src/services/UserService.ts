import bcrypt from "bcryptjs";
import { db } from "../database/connection";
import {CreateUserDTO} from "../types/User";
import {UpdateUserDTO} from "../types/User";
import {UserWithoutPassword} from "../types/User";
import { UserGetMe } from "../types/User";
import { PublicUserProfile } from "../types/User";

class UserService {
  async findById(id: number): Promise <UserWithoutPassword> {
    const user = await db('users').where({ id }).first();
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    delete user.password_hash;
    delete user.password_reset_token;
    delete user.password_reset_expires;
    return user as UserWithoutPassword;
  }

  async findPublicUserById(id: number): Promise<PublicUserProfile>{
    const user = await db('users').select('id','name','profile_picture_url','bio','average_rating').where({ id }).first();
    if(!user){
      throw new Error("Usuário não encontrado.");
    }
    return user as PublicUserProfile
  }

  async findMe(id: number): Promise<UserGetMe> {
    const user = await db('users').where({ id }).first();
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    delete user.password_hash;
    delete user.password_reset_token;
    delete user.password_reset_expires;
    delete user.created_at;
    delete user.updated_at;
    delete user.role;
    return user as UserGetMe;
  }
  
  async create({ name, email, password, birth_date, phone }: CreateUserDTO): Promise<UserWithoutPassword>{
    const existingUser = await db("users").where({ email }).first();

    if (existingUser) {
      throw new Error("Este e-mail já está em uso.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [user] = await db("users")
      .insert({
        name,
        email,
        password_hash,
        birth_date,
        phone,
        role: "USER",
      })
      .returning("*");

    delete user.password_hash;
    delete user.password_reset_token;
    delete user.password_reset_expires;

    return user as UserWithoutPassword;
  }
  async updateMe(id: number, data: UpdateUserDTO): Promise<UserWithoutPassword>{
    await db('users').where({ id: id }).update(data);
    const updatedUser = await this.findById(id);
    return updatedUser;
  }
  
}

export default new UserService();
