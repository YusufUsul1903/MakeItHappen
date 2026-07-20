export async function up(knex) {
  await knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();

    table.string("title", 200).notNullable();

    table.boolean("completed").defaultTo(false);

    table
      .integer("category_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("categories")
      .onDelete("SET NULL");

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
  await knex.schema.dropTableIfExists("tasks");
}