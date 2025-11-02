import bcrypt from "bcryptjs";
import { db } from "../database/connection";
import {CreateUserDTO} from "../dto/UserDTO";
import { UpdateUserDTO } from "../dto/UserDTO";
import { UserWithoutPasswordDTO } from "../dto/UserDTO";
import { UserGetMeDTO } from "../dto/UserDTO";
import { PublicUserProfileDTO } from "../dto/UserDTO";
import path from 'path'; 
import fs from 'fs/promises';
import uploadConfig from '../upload-images/upload';

class UserService {
  async findById(id: number): Promise <UserWithoutPasswordDTO> {
    const user = await db('users').where({ id }).first();
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    delete user.password_hash;
    delete user.password_reset_token;
    delete user.password_reset_expires;
    return user as UserWithoutPasswordDTO;
  }

  async findPublicUserById(id: number): Promise<PublicUserProfileDTO>{
    const user = await db('users').select('id','name','profile_picture_url','bio','average_rating').where({ id }).first();
    if(!user){
      throw new Error("Usuário não encontrado.");
    }
    return user as PublicUserProfileDTO
  }

  async findMe(id: number): Promise<UserGetMeDTO> {
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
    return user as UserGetMeDTO;
  }
  
  async create({ name, email, password, birth_date, phone }: CreateUserDTO): Promise<UserWithoutPasswordDTO>{
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

    return user as UserWithoutPasswordDTO;
  }
  async updateMe(id: number, data: UpdateUserDTO): Promise<UserWithoutPasswordDTO>{
    await db('users').where({ id: id }).update(data);
    const updatedUser = await this.findById(id);
    return updatedUser;
  }
  async updateAvatar(id: number, AvatarName: string): Promise<UserWithoutPasswordDTO>{
    const user = await db('users').where({ id }).first();
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    if (user.profile_picture_url) {
      const oldAvatarFilename = path.basename(user.profile_picture_url);
      const oldAvatarFilePath = path.join(uploadConfig.directory, oldAvatarFilename);
      await fs.stat(oldAvatarFilePath);
      await fs.unlink(oldAvatarFilePath);
      console.log(`[UserService] Avatar antigo deletado: ${oldAvatarFilename}`);
      const profilePictureUrl = `http://localhost:3333/files/${AvatarName}`;
      await db("users").where({ id: id }).update({profile_picture_url: profilePictureUrl});
      return this.findById(id);
    }
    const profilePictureUrl = `http://localhost:3333/files/${AvatarName}`;
    await db('users').where({ id: id }).update({profile_picture_url: profilePictureUrl});
    return this.findById(id);
  }
}

export default new UserService();
