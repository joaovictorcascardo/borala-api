import knex from "knex";
import knexConfig = require("../../knexfile");

const db = knex((knexConfig as any).development);

export { db };
