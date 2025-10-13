import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('vehicles', (table) => {
        table.bigIncrements('id').primary();
        
        table.bigInteger('user_id')      
             .notNullable()              
             .references('id')           
             .inTable('users')           
             .onDelete('CASCADE');     
        
        table.string('brand', 100).notNullable();
        table.string('model', 100).notNullable();
        table.string('color', 50).notNullable();
        table.string('license_plate', 10).notNullable().unique();
        table.integer('year').notNullable();
        table.integer('seats').notNullable();

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('vehicles');
}