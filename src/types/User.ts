export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    birth_date: Date;
    phone?: string;
}
export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    birth_date: Date;
    phone: string | null;
    role: string;
    created_at: Date;
    updated_at: Date;
    password_reset_token: string | null;
    password_reset_expires: Date | null;
}
export interface UpdateUserDTO {
    name: string;
    phone: string | null;
    bio: string | null;
}
export interface UserWithoutPassword {
    id: number;
    name: string;
    email: string;
    birth_date: Date;
    phone: string | null;
    role: string;
    created_at: Date;
    updated_at: Date;
}