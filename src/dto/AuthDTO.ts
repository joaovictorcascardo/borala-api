export interface LoginDTO {
    email: string;
    password: string;
}
export interface ResetPasswordDTO {
    token: string;
    password: string;
    password_confirmation: string;
}