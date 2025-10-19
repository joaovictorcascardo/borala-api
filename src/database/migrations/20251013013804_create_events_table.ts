import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("events", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 255).notNullable();
    table.string("address", 255).notNullable();
    table.decimal("latitude", 9, 6).notNullable();
    table.decimal("longitude", 9, 6).notNullable();
    table.timestamp("starts_at").notNullable();
    table.timestamp("ends_at").notNullable();
    table.text("description").nullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("events");
}
