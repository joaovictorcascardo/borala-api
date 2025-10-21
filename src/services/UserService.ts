import bcrypt from 'bcryptjs';
import { db } from '../database/connection';

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    birth_date: Date;
}

class UserService {
    async create({ name, email, password, birth_date }: CreateUserDTO) {
        const existingUser = await db('users').where({ email }).first();

        if (existingUser) {
            throw new Error('Este e-mail já está em uso.');
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [user] = await db('users')
            .insert({
                name,
                email,
                password_hash, 
                birth_date,
                role: 'USER'
            })
            .returning('*'); 
        
        delete user.password_hash;

        return user;
    }

}

export default new UserService();