import { db } from "../database/connection";
import { CreateUserDTO } from "../dto/UserDTO";
import { UpdateUserDTO } from "../dto/UserDTO";
import { UserWithoutPasswordDTO } from "../dto/UserDTO";
import { UserGetMeDTO } from "../dto/UserDTO";
import { PublicUserProfileDTO } from "../dto/UserDTO";
import path from 'path';
import fs from 'fs/promises';
import uploadConfig from '../upload-images/upload';

export class UserData{
    async getById(userId: number): Promise<UserGetMeDTO>{
        try{
            const user = await db('users').where({ id: userId }).first();
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
            
        }catch(error: any){
            throw new Error(error.message);
        }
    }
    async findPublicProfile(userId: number): Promise<PublicUserProfileDTO> {
        try{
            const user = await db('users').select('id', 'name', 'profile_picture_url', 'bio', 'average_rating').where({ id: userId }).first();
            if (!user) {
                throw new Error("Usuário não encontrado.");
            }
            return user as PublicUserProfileDTO
        }catch(error : any){
            throw new Error(error.message);
        }
    }
    async existingUser({ name, email, password, birth_date, phone }: CreateUserDTO){
        try{
            const verifyEmail = await db("users").where({ email }).first();
            if (verifyEmail) {
                throw new Error("Este e-mail já está em uso.");
            }
            return null;
        }catch(error: any){
            throw new Error(error.message);            
        }
    }
    async createUser(name: string, email: string, password_hash: string, birth_date: Date, phone: string | undefined): Promise<UserWithoutPasswordDTO>{
        try{
            const [userCreated] = await db("users")
                .insert({
                    name,
                    email,
                    password_hash,
                    birth_date,
                    phone,
                    role: "USER",
                })
                .returning("*");
            delete userCreated.password_hash;
            delete userCreated.password_reset_token;
            delete userCreated.password_reset_expires;
            return userCreated as UserWithoutPasswordDTO;
        }catch(error: any){
            throw new Error(error.message);              
        }
    }
    async updateUser(id: number, data: UpdateUserDTO): Promise<void>{
        try{
            await db('users').where({ id: id }).update(data);
        }catch(error: any){
            throw new Error(error.message);      
        }
    }
    async updateAvatar(id: number, AvatarName: string): Promise<PublicUserProfileDTO>{
        try{
            const user = await db('users').where({ id }).first();
            if (!user) {
                throw new Error("Usuário não encontrado.");
            }
            if (user.profile_picture_url) {
                const oldAvatarFilename = path.basename(user.profile_picture_url);
                const oldAvatarFilePath = path.join(uploadConfig.directory, oldAvatarFilename);
                await fs.stat(oldAvatarFilePath);
                await fs.unlink(oldAvatarFilePath);
                const profilePictureUrl = `http://localhost:3333/files/${AvatarName}`;
                await db("users").where({ id: id }).update({ profile_picture_url: profilePictureUrl });
                return this.findPublicProfile(id);
            }
            const profilePictureUrl = `http://localhost:3333/files/${AvatarName}`;
            await db('users').where({ id: id }).update({ profile_picture_url: profilePictureUrl });
            return this.findPublicProfile(id);
        }catch(error: any){
            throw new Error(error.message);   
        }
    }
}