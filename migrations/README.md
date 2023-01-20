Adding a new migration:
```
$ npx knex migrate:make migration_name
```

Migrate forwards:
```
$ npx knex migrate:latest
```

Migrate backwards one:
```
$ npx knex migrate:down
```

Running a seed (file to be located in <project>/migrations/seeds/seed_file_name.js):
```
$ npx knex seed:run --specific=seed_items.js
```

Knex Cheatsheet:
https://devhints.io/knex
