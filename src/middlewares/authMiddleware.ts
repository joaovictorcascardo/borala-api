import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  iat: number;
  exp: number;
  userId: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): void {
  console.log("--- AuthMiddleware START ---");

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    console.log("AuthMiddleware: Falha - Cabeçalho Authorization ausente.");
    response
      .status(401)
      .json({ error: "Token de autenticação não fornecido." });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("AuthMiddleware: Falha - Formato do token inválido.");
    response.status(401).json({ error: "Token mal formatado." });
    return;
  }

  const token = parts[1];
  console.log("AuthMiddleware: Token recebido:", token ? "Sim" : "Não");

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error(
        "ERRO FATAL no AuthMiddleware: Segredo JWT não definido no .env"
      );
      throw new Error(
        "Erro interno do servidor na configuração de autenticação."
      );
    }

    const decoded = jwt.verify(token, secret);
    const userId = (decoded as TokenPayload).userId;
    console.log("AuthMiddleware: Token decodificado com sucesso.");

    if (!userId) {
      console.error(
        "AuthMiddleware: Falha - ID do usuário (sub/userId) não encontrado no payload do token."
      );
      throw new Error("Token inválido - payload incorreto.");
    }

    request.user = { id: Number(userId) };
    console.log(
      "AuthMiddleware: ID do usuário anexado à requisição:",
      request.user.id
    );

    return next();
  } catch (error) {
    console.error("AuthMiddleware: Falha na verificação do token:", error);
    response.status(401).json({ error: "Token inválido ou expirado." });
    return;
  }
}
