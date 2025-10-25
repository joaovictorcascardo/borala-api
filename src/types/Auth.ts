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