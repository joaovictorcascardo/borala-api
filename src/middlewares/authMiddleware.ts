import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/Auth";
import { TokenPayload } from "../types/Auth";

export function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response
      .status(401)
      .json({ error: "Token de autenticação não fornecido." });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    response.status(401).json({ error: "Token mal formatado." });
    return;
  }

  const token = parts[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        "Erro interno do servidor na configuração de autenticação."
      );
    }

    const decoded = jwt.verify(token, secret);
    const userId = (decoded as TokenPayload).userId;
    const userRole = (decoded as TokenPayload).role;

    if (!userId || !userRole) {
      throw new Error("Token inválido - payload incorreto.");
    }

    request.user = { id: Number(userId), role: String(userRole) };

    return next();
  } catch (error) {
    response.status(401).json({ error: "Token inválido ou expirado." });
    return;
  }
}
