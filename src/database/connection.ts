import knex from "knex";
import knexConfig = require("../../knexfile");

const env = process.env.NODE_ENV || "development";
const config = (knexConfig as any)[env];
const db = knex(config);

export { db };
