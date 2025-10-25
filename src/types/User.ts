export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    birth_date: Date;
    phone?: string;
}
  