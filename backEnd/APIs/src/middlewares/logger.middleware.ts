import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Chemin vers le dossier de logs
const LOG_DIR = path.join(process.cwd(), "log");

// Créer le dossier log s'il n'existe pas
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Formatte la date pour les logs
 */
function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Nettoie les headers pour éviter de logger des données sensibles
 */
function sanitizeHeaders(
  headers: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized = { ...headers };
  // Masquer les données sensibles
  if (sanitized["authorization"]) {
    sanitized["authorization"] = "[MASQUÉ]";
  }
  if (sanitized["cookie"]) {
    sanitized["cookie"] = "[MASQUÉ]";
  }
  return sanitized;
}

/**
 * Nettoie le body pour éviter de logger des données sensibles
 */
function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== "object") {
    return body;
  }

  const sanitized = { ...(body as Record<string, unknown>) };
  const sensitiveFields = [
    "password",
    "token",
    "refreshToken",
    "secret",
    "authorization",
  ];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = "[MASQUÉ]";
    }
  }

  return sanitized;
}

/**
 * Fonction pour écrire le log
 */
function writeLog(
  timestamp: string,
  method: string,
  url: string,
  requestHeaders: Record<string, unknown>,
  requestBody: unknown,
  statusCode: number,
  start: number,
) {
  const duration = Date.now() - start;

  // Créer l'entrée de log
  const logEntry = {
    timestamp,
    request: {
      method,
      url,
      headers: requestHeaders,
      body: requestBody,
    },
    response: {
      statusCode,
      duration: `${duration}ms`,
    },
  };

  // Formatter le log (JSON format)
  const logLine = JSON.stringify(logEntry, null, 2);

  // Écrire dans le fichier de logs
  const logFile = path.join(
    LOG_DIR,
    `requests-${new Date().toISOString().split("T")[0]}.log`,
  );
  fs.appendFileSync(logFile, logLine + "\n" + "-".repeat(80) + "\n");

  // Logger aussi dans la console pour le développement
  console.log(
    `[${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms`,
  );
}

/**
 * Middleware de logging pour enregistrer toutes les requêtes dans un fichier
 */
export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();
  const timestamp = formatDate(new Date());

  // Stocker la méthode originale et l'URL
  const method = req.method;
  const url = req.url;
  const requestHeaders = sanitizeHeaders(
    req.headers as Record<string, unknown>,
  );
  const requestBody = sanitizeBody(req.body);

  // Capturer la réponse - intercepter plusieurs méthodes de réponse
  const originalJson = res.json;
  const originalSend = res.send;

  // Fonction de logging réutilisable
  const logResponse = () => {
    writeLog(
      timestamp,
      method,
      url,
      requestHeaders,
      requestBody,
      res.statusCode,
      start,
    );
  };

  // Remplacer json pour capturer les réponses
  res.json = function (body: unknown): Response {
    logResponse();
    return originalJson.call(this, body);
  };

  // Remplacer send pour capturer les réponses
  res.send = function (body: unknown): Response {
    logResponse();
    return originalSend.call(this, body);
  };

  next();
}

export default loggerMiddleware;
