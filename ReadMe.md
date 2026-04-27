# NodeMovieApi

> **Database setup:** This API depends on a PostgreSQL database. Use the
> [Postgres-Movie-Platform](https://github.com/stevenwickers/Postgres-Movie-Platform)
> repo to create the database, schema, seed data, and stored functions required
> for this API to work.

`NodeMovieApi` is a local-development Node.js movie API built with Express, TypeScript, PostgreSQL, Swagger, and GraphQL.

## 🔍 Select
![Select](./assets/demo-select.gif)

## ✏️ Update
![Update](./assets/demo-update.gif)

## 🩹 Patch
![Patch](./assets/demo-patch.gif)

The project exposes:

- REST endpoints for movies
- REST endpoints for genres
- A GraphQL endpoint for querying movies and patching movie data
- Swagger UI for exploring the REST API
- Request logging, correlation IDs, CORS, and centralized error handling

## Tech Stack

- Node.js
- TypeScript
- Express 5
- PostgreSQL via `pg`
- GraphQL Yoga
- Swagger / OpenAPI
- Zod
- Pino

## Features

- Browse, create, update, patch, and delete movies
- Browse genres and fetch a genre by ID
- Filter and paginate movie results
- Sort movie results by supported columns
- Query movies through GraphQL
- Patch movie records through a GraphQL mutation-backed repository method

## Endpoints

### REST

- `GET /movies`
- `GET /movies/{id}`
- `POST /movies`
- `PUT /movies/{id}`
- `PATCH /movies/{id}`
- `DELETE /movies/{id}`
- `GET /health`
- `GET /genres`
- `GET /genres/{id}`
- `GET /` redirects to Swagger UI

Swagger UI is available at:

- `http://localhost:5001/swagger`

### GraphQL

GraphQL is enabled through GraphQL Yoga and is mapped at:

- `GET /graphql`
- `POST /graphql`

Current GraphQL operations include:

- Query movies with optional filters
- Query a movie by ID
- Update a movie using a patch request

Example query:

```graphql
query {
  movies(filters: { search: "avatar", searchMode: "general", page: 1, pageSize: 10 }) {
    items {
      id
      movieName
      releaseDate
      genres
    }
    totalCount
    totalPages
  }
}
```

Example mutation:

```graphql
mutation {
  updateMovie(
    id: "00000000-0000-0000-0000-000000000000"
    patch: { movieName: "Updated Title", genreNames: ["Action", "Sci-Fi"] }
  ) {
    id
    movieName
    genres
    updatedAt
  }
}
```

## Movie Query Support

The `GET /movies` endpoint supports:

- `search`
- `searchMode`
- `page`
- `pageSize`
- `sortBy`
- `sortDirection`
- `releaseDateFrom`
- `releaseDateTo`
- `worldwideGrossMin`
- `worldwideGrossMax`
- `productionBudgetMin`
- `productionBudgetMax`
- `domesticGrossMin`
- `domesticGrossMax`
- `genres`

Supported `searchMode` values:

- `general`
- `starts`
- `ends`
- `contains`

## Running Locally

This project is intended as a local development proof of concept.

### Requirements

- Node.js
- PostgreSQL running locally

### Configuration

Create a `.env` file:

```env
NODE_ENV=development
PORT=5001
CORS_ALLOW_ORIGINS=http://localhost:5173,http://localhost:3000
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:55432/wickers_db
```

### Start the API

```bash
npm install
npm run dev
```

## Notes

- REST and GraphQL both use the same repository layer and PostgreSQL functions.
- GraphQL patching is backed by `wickers.update_graphql_movie`.
- Unhandled REST errors return a correlation ID for tracing.
  schemas/
  openapi/
  middleware/
  utils/
  contracts/
```

---

## 🔗 Related Project

👉 **postgres-movie-platform**

This API depends on the PostgreSQL data platform that:

* provisions schema
* seeds data
* exposes database functions

---

## 💼 Resume Highlight

> Built a Node.js API using TypeScript, PostgreSQL stored procedures, Zod validation, and Pino logging, with full OpenAPI documentation and reproducible environment setup.

---

## 🚀 Future Enhancements

* React frontend integration
* Pagination & sorting
* Authentication (JWT)
* Rate limiting
* C# API parity
* Full stack Docker orchestration

---

## 👨‍💻 Author

**Steven Wickers**
Senior / Lead Frontend Engineer
React • TypeScript • Node • C# • PostgreSQL • Cloud

---

## 🔍 Keywords

Node.js API, TypeScript backend, PostgreSQL stored procedures, Swagger API, OpenAPI, Zod validation, Pino logging, Express API, REST API, backend architecture
