import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rides", (table) => {
    table.boolean("automatic_approval").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rides", (table) => {
    table.dropColumn("automatic_approval");
  });
}
