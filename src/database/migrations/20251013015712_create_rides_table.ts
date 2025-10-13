import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("rides", (table) => {
    table.bigIncrements("id").primary();

    table
      .bigInteger("driver_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .bigInteger("vehicle_id")
      .notNullable()
      .references("id")
      .inTable("vehicles")
      .onDelete("CASCADE");

    table
      .bigInteger("event_id")
      .nullable()
      .references("id")
      .inTable("events")
      .onDelete("SET NULL");

    table.string("origin_address", 255).notNullable();
    table.decimal("origin_latitude", 9, 6).notNullable();
    table.decimal("origin_longitude", 9, 6).notNullable();
    table.string("destination_address", 255).notNullable();
    table.decimal("destination_latitude", 9, 6).notNullable();
    table.decimal("destination_longitude", 9, 6).notNullable();

    table.timestamp("departure_time").notNullable();
    table.integer("available_seats").notNullable();
    table.decimal("price_per_seat", 10, 2).notNullable();
    table.string("status", 20).notNullable().defaultTo("SCHEDULED");
    table.text("additional_info").nullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("rides");
}
