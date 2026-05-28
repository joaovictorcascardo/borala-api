import type { Knex } from "knex";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const getConnection = () => {
  console.log("[DB] DATABASE_URL set:", !!process.env.DATABASE_URL);
  console.log("[DB] DB_HOST:", process.env.DB_HOST);
  console.log("[DB] DB_USER:", process.env.DB_USER);

  if (process.env.DATABASE_URL) {
    console.log("[DB] Using DATABASE_URL connection string");
    return process.env.DATABASE_URL;
  }

  if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
    console.error("ERRO: Variáveis de ambiente do banco não carregadas");
    process.exit(1);
  }

  console.log("[DB] Using individual DB_* variables");
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
};

const baseConfig: Knex.Config = {
  client: "pg",
  connection: getConnection() as any,
  migrations: {
    directory: path.join(__dirname, "src", "database", "migrations"),
    extension: "ts",
  },
  seeds: {
    directory: path.join(__dirname, "src", "database", "seeds"),
  },
};

const testConfig: Knex.Config = {
  ...baseConfig,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
  },
};

const config: { [key: string]: Knex.Config } = {
  development: baseConfig,
  production: baseConfig,
  test: testConfig,
};

module.exports = config;
