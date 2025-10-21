import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', (table) => {
        table.string('role', 25)          
             .notNullable()               
             .defaultTo('USER');         
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('role');
    });
}