# 🎬 NodeMovieApi

A TypeScript-based backend API demonstrating **REST + GraphQL parity**, advanced filtering, and PostgreSQL-powered query logic.

---

## 🎬 Demo

### 🔍 Fetch Movies

![Fetch Movies](./assets/demo-select.gif)

### ✨ Create Movie

![Create Move](./assets/demo-create.gif)

### ✏️ Update Movie

![Update Movie](./assets/demo-update.gif)

### 🩹 Patch Movie

![Patch Movie](./assets/demo-patch.gif)

### 🗑️ Delete Movie

![Delete Movie](./assets/demo-delete.gif)

---

## ⭐ Key Concept

This project demonstrates how **REST and GraphQL can share the same repository layer and PostgreSQL functions**—avoiding duplicated business logic while supporting multiple API paradigms.

---

## 🏗️ Platform Architecture

```mermaid
flowchart TD

subgraph UI["🎨 Frontend Layer"]
  ReactUI["React Movie Dashboard<br/>Filtering • CRUD • API Toggle"]
end

subgraph API["⚙️ API Layer"]
  NodeAPI["NodeMovieApi<br/>TypeScript • Express<br/>REST + GraphQL"]
  DotNetAPI["DotNetMovieApi<br/>.NET Minimal APIs • C#<br/>REST + GraphQL"]
end

subgraph DATA["🐘 Data Platform Layer"]
  Functions["PostgreSQL Function Layer<br/>Filtering • Paging • Sorting • CRUD"]
  Tables["Relational Model<br/>movies • genres • movie_genres"]
end

ReactUI --> NodeAPI
NodeAPI --> Functions
Functions --> Tables

ReactUI -. Alternative implementation .-> DotNetAPI
DotNetAPI -. Shares same data layer .-> Functions

classDef frontend fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0f172a;
classDef primaryApi fill:#dcfce7,stroke:#16a34a,stroke-width:3px,color:#0f172a;
classDef secondaryApi fill:#f3f4f6,stroke:#9ca3af,stroke-width:1px,color:#374151;
classDef data fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#0f172a;

class ReactUI frontend;
class NodeAPI primaryApi;
class DotNetAPI secondaryApi;
class Functions,Tables data;
```

This repository is the **Node.js / TypeScript implementation** of a multi-stack movie platform that shares a common PostgreSQL function layer with the .NET API.

## ⚙️ Tech Stack

* **Node.js + TypeScript**
* **Express 5**
* **PostgreSQL** (stored procedures / functions)
* **GraphQL Yoga**
* **Swagger / OpenAPI**
* **Zod** (validation)
* **Pino** (structured logging)

---

## 🚀 Features

* Full CRUD for movies (REST + GraphQL)
* Advanced filtering, sorting, and pagination
* Shared repository layer across REST and GraphQL
* PostgreSQL-backed query logic via functions
* Centralized error handling with correlation IDs
* Request logging and CORS support
* Swagger UI for REST exploration

---

## 📡 API Overview

### REST

* `GET /movies`
* `GET /movies/{id}`
* `POST /movies`
* `PUT /movies/{id}`
* `PATCH /movies/{id}`
* `DELETE /movies/{id}`
* `GET /genres`
* `GET /genres/{id}`
* `GET /health`

👉 Swagger UI:
`http://localhost:5001/swagger`

---

### GraphQL

* `GET /graphql`
* `POST /graphql`

#### Example Query

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

#### Example Mutation

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

---

## 🧠 Query Capabilities

The `/movies` endpoint supports:

* Search (`general`, `starts`, `ends`, `contains`)
* Pagination (`page`, `pageSize`)
* Sorting (`sortBy`, `sortDirection`)
* Date range filtering
* Financial filters (budget, gross)
* Genre filtering

---

## 🛠️ Running Locally

### Requirements

* Node.js
* PostgreSQL

### Setup

```bash
npm install
npm run dev
```

### Environment

```env
NODE_ENV=development
PORT=5001
CORS_ALLOW_ORIGINS=http://localhost:5173,http://localhost:3000
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:55432/wickers_db
```

---

## 🔗 Related Project

👉 PostgreSQL Data Platform (schema, seed data, functions):
https://github.com/stevenwickers/Postgres-Movie-Platform

---

## 💡 Highlights

* Demonstrates **real-world backend architecture patterns**
* Shows **GraphQL + REST coexistence without duplication**
* Uses **PostgreSQL functions for complex querying**
* Designed as a **portfolio-ready API with production-style concerns**

---

## 🚀 Future Enhancements

* React frontend integration
* Authentication (JWT)
* Rate limiting
* Dockerized full-stack environment
* C# API parity

---

## 👨‍💻 Author

**Steven Wickers**
Senior / Lead Frontend Engineer
React • TypeScript • Node • C# • PostgreSQL • Cloud

---

## 🔍 Keywords

Node.js API, TypeScript backend, PostgreSQL, GraphQL, REST API, Swagger, OpenAPI, backend architecture
