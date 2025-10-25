import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}
export interface TokenPayload {
    iat: number;
    exp: number;
    userId: string;
}
export interface LoginDTO {
    email: string;
    password: string;
  }
export interface ResetPasswordDTO {
    token: string;
    password: string;
    password_confirmation: string;
  }