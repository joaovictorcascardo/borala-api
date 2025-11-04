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
    const user = await this.userData.getById(id);
    return user ;
  }

  async findPublicUserById(id: number): Promise<PublicUserProfileDTO>{
    const user = await this.userData.findPublicProfile(id);
    return user;
  }

  async create({ name, email, password, birth_date, phone }: CreateUserDTO): Promise<UserWithoutPasswordDTO>{
    await this.userData.existingUser({name, email, password, birth_date, phone}); 
    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.userData.createUser(name, email, password_hash, birth_date, phone)
    return user as UserWithoutPasswordDTO;
  }

  async updateMe(id: number, data: UpdateUserDTO): Promise<UserGetMeDTO>{
    await this.userData.updateUser(id, data);
    const updatedUser = await this.findById(id);
    return updatedUser;
  }

  async updateAvatar(id: number, AvatarName: string): Promise<PublicUserProfileDTO>{
    const user = this.userData.updateAvatar(id, AvatarName);
    return user;
  }
}

export default new UserService();
