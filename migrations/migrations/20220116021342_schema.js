const { onUpdateTrigger } = require("../knexfile")

exports.up = async (knex) => {
    await knex.schema.createTable("authors", function (table) {
        table.string("id", 24).defaultTo(knex.raw("cuid2()")).primary()
        table.string("name")

        table.timestamps(true, true)
    })
    await knex.raw(onUpdateTrigger("authors"))

    await knex.schema.createTable("books", function (table) {
        table.string("id", 24).defaultTo(knex.raw("cuid2()")).primary()
        table.string("title")
        table.string("isbn")
        table.dateTime("published_at", { precision: 6 })

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
        table.string("id", 24).defaultTo(knex.raw("cuid2()")).primary()
        table.string("client")
        table.text("state")
        table.text("vector")

        table.timestamps(true, true)
        table.unique("client")
    })
    await knex.raw(onUpdateTrigger("crdt"))
}

exports.down = async (knex) => {
    await knex.schema.dropTable("books")
    await knex.schema.dropTable("authors")
    await knex.schema.dropTable("crdt")
}
