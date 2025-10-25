import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rides", (table) => {
    table.dropColumn("price_per_seat");
    table.decimal("estimated_total_cost", 10, 2).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("rides", (table) => {
    table.dropColumn("estimated_total_cost");
    table.decimal("price_per_seat", 10, 2).notNullable().defaultTo(0.0);
  });
}
