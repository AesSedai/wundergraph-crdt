## Setup
Prerequisite: Have npm, docker, and docker compose installed

- Start the database and hasura server
```
$ docker compose up db graphql-engine
```
- Apply migrations
```
$ cd migrations
$ npm install
$ npx knex migrate:latest
```
- Go back to project root and stop docker compose services with `ctrl+c`
- Install `client` and `wundergraph` dependencies
```
$ cd client
$ npm install
$ cd ../wundergraph
$ npm install 
```
- Start up all services with `docker compose up`

- Client is available on `http://127.0.0.1:3000`
- Hasura is available on `http://127.0.0.1:8091/console/api/api-explorer`
