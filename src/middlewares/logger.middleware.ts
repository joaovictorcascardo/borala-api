import { Request, Response, NextFunction } from "express";

const SENSITIVE_FIELDS = ["password", "password_hash", "token", "authorization"];

function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      SENSITIVE_FIELDS.includes(k.toLowerCase()) ? "***" : v,
    ])
  );
}

function getUserId(req: Request): string {
  const user = (req as Request & { user?: { id?: string } }).user;
  return user?.id ?? "anonymous";
}

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const ip = req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown";

  const chunks: Buffer[] = [];
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    chunks.push(Buffer.from(JSON.stringify(body)));
    return originalJson(body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const level = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO";

    const log: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      method: req.method,
      path: req.originalUrl,
      status,
      duration_ms: duration,
      ip,
      user_id: getUserId(req),
    };

    if (Object.keys(req.query).length > 0) {
      log.query = req.query;
    }

    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      log.body = sanitize(req.body as Record<string, unknown>);
    }

    if (status >= 400 && chunks.length > 0) {
      try {
        log.response = JSON.parse(chunks.join(""));
      } catch {
        // ignore parse errors
      }
    }

    const line = JSON.stringify(log);
    if (level === "ERROR") console.error(line);
    else if (level === "WARN") console.warn(line);
    else console.log(line);
  });

  next();
}
