import bcrypt from "bcryptjs";
import { UserData } from "../data/User.Data";
import {CreateUserDTO} from "../dto/UserDTO";
import { UpdateUserDTO } from "../dto/UserDTO";
import { UserWithoutPasswordDTO } from "../dto/UserDTO";
import { UserGetMeDTO } from "../dto/UserDTO";
import { PublicUserProfileDTO } from "../dto/UserDTO";

class UserService {
  userData = new UserData();
  async findById(id: number): Promise<UserGetMeDTO> {
    try{
      const user = await this.userData.getById(id);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }
      return user ;
    }catch(error: any){
      throw new Error(error.message);      
    }
    
  }

  async findPublicUserById(id: number): Promise<PublicUserProfileDTO>{
    try{
      const user = await this.userData.findPublicProfile(id);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }
      return user;
    }catch(error: any){
      throw new Error(error.message);      
    }
    
  }

  async create({ name, email, password, birth_date, phone }: CreateUserDTO): Promise<UserWithoutPasswordDTO>{
    try{
      const verifyEmail = await this.userData.existingUser(email); 
      if (verifyEmail != false) {
        throw new Error("Este e-mail já está em uso.");
      }
      const password_hash = await bcrypt.hash(password, 10);
      const user = await this.userData.createUser(name, email, password_hash, birth_date, phone)
      return user as UserWithoutPasswordDTO;
    }catch(error:any){
      throw new Error(error.message);    
    }
  }

  async updateMe(id: number, data: UpdateUserDTO): Promise<UserGetMeDTO>{
    try{
      await this.userData.updateUser(id, data);
      const updatedUser = await this.findById(id);
      return updatedUser;
    }catch(error: any){
      throw new Error(error.message);   
    }
  }

  async updateAvatar(id: number, AvatarName: string): Promise<PublicUserProfileDTO>{
    try{
      const user = await this.userData.updateAvatar(id, AvatarName);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }
      return user;
    }catch(error: any){
      throw new Error(error.message);   
    }
  }
}

export default new UserService();
