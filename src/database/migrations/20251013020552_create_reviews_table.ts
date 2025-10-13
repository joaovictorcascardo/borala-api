import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("reviews", (table) => {
    table.bigIncrements("id").primary();

    table
      .bigInteger("ride_id")
      .notNullable()
      .references("id")
      .inTable("rides")
      .onDelete("CASCADE");

    table
      .bigInteger("reviewer_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .bigInteger("reviewee_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.integer("rating").notNullable();
    table.text("comment").nullable();

    table.unique(["ride_id", "reviewer_id", "reviewee_id"]);
    table.check("rating >= 1 AND rating <= 5", undefined, "rating_check");

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("reviews");
}
