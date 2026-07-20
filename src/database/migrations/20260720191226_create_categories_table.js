export async function up(knex) {
  await knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();

    table.string("name", 50).notNullable();

    table.string("color").defaultTo("#3B6D11");

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("categories");
}