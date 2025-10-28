export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    birth_date: Date;
    phone?: string;
}
export interface UpdateUserDTO {
    name: string;
    phone: string | null;
    bio: string | null;
}
export interface UserWithoutPasswordDTO {
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
export interface UserGetMeDTO {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    bio: string;
    birth_date: Date;
    average_rating: number;
}
export interface PublicUserProfileDTO {
    id: number;
    name: string;
    profile_picture_url: string | null;
    bio: string | null;
    average_rating: number | null;
}