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
    bio: string;
    password_hash: string;
    average_rating: number;
    birth_date: Date;
    phone: string | null;
    profile_picture_url: string;
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
    average_rating: number;
    birth_date: Date;
    phone: string | null;
    role: string;
    created_at: Date;
    updated_at: Date;
}
export interface UserGetMe{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    bio: string;
    birth_date: Date;
    average_rating: number;
}
export interface PublicUserProfile {
    id: number; 
    name: string;
    profile_picture_url: string | null;
    bio: string | null;     
    average_rating: number | null;    
}