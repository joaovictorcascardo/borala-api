import type { Knex } from "knex";
import path from "path";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "1209",
      database: "carona_api",
    },
    migrations: {
      directory: path.join(__dirname, "src", "database", "migrations"),
      extension: "ts",
    },
  },
};

module.exports = config;
