const { onUpdateTrigger } = require("../knexfile")

exports.up = async (knex) => {
    await knex.schema.createTable("authors", function (table) {
        table.string("id", 24).defaultTo(knex.raw("cuid2()")).primary().notNull()
        table.string("name").notNull()

        table.timestamps(true, true)
    })
    await knex.raw(onUpdateTrigger("authors"))

    await knex.schema.createTable("books", function (table) {
        table.string("id", 24).defaultTo(knex.raw("cuid2()")).primary().notNull()
        table.string("title").notNull()
        table.string("isbn").notNull()
        table.dateTime("published_at", { precision: 6 }).notNull()

        table
            .string("author_id", 24)
            .index()
            .references("id")
            .inTable("public.authors")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")

        table.timestamps(true, true)
    })
    await knex.raw(onUpdateTrigger("books"))

    await knex.schema.createTable("crdt", function (table) {
        table.string("id", 24).defaultTo(knex.raw("cuid2()")).primary().notNull()
        table.string("room").notNull()
        table.string("client").unique().notNull()
        table.uuid("guid").unique().notNull()
        table.text("state").notNull()
        table.text("vector").notNull()

        table.timestamps(true, true)
    })
    await knex.raw(onUpdateTrigger("crdt"))

    await knex.schema.createTable("clients", function (table) {
        table.string("id", 24).defaultTo(knex.raw("cuid2()")).primary().notNull()
        table.string("client").unique().notNull()
        table.uuid("guid").notNull()
        table.text("vector").notNull()

        table
            .string("crdt_id", 24)
            .index()
            .references("id")
            .inTable("public.crdt")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")

        table.timestamps(true, true)
    })
    await knex.raw(onUpdateTrigger("clients"))
}

exports.down = async (knex) => {
    await knex.schema.dropTable("clients")
    await knex.schema.dropTable("crdt")
    await knex.schema.dropTable("books")
    await knex.schema.dropTable("authors")
}
