import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}
export interface TokenPayload {
  iat: number;
  exp: number;
  userId: string;
  role: string;
}
