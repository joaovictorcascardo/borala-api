import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("bookings", (table) => {
    table.bigIncrements("id").primary();

    table
      .bigInteger("ride_id")
      .notNullable()
      .references("id")
      .inTable("rides")
      .onDelete("CASCADE");

    table
      .bigInteger("passenger_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.integer("seats_booked").notNullable().defaultTo(1);
    table.string("status", 20).notNullable().defaultTo("PENDING");

    table.unique(["ride_id", "passenger_id"]);

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("bookings");
}
