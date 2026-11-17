# Library Management System

A database project built with Prisma and PostgreSQL to manage library users, books, and genres.

## Project Layout

- `api/` contains the Prisma schema, migrations, seed script, and Prisma service.
- `library-api/` contains the NestJS application.

Both directories are part of this repository; `library-api/` is not a separate Git submodule.

## Technologies Used

- Node.js
- Prisma ORM
- PostgreSQL
- TypeScript

## Database Schema

The database contains three main models:

- **User:** Stores library user details, including name, email, password, and role.
- **Genre:** Stores book genres, including a unique name and slug.
- **Book:** Stores book details, including title, author, ISBN, total copies, and available copies.

The `Role` enum defines two user roles: `PATRON` and `LIBRARIAN`.

## Schema Decisions

The `Book` model uses a `genreId` foreign key to reference the `Genre` model instead of embedding genre information directly in each book.

This relational approach avoids repeating genre details across multiple books. It also makes it easier to update a genre in one place and maintain data consistency.

The relationship is implemented using Prisma's `@relation` attribute:

- `Book.genreId` stores the referenced genre's ID.
- `Book.genre` defines the relationship with the `Genre` model.
- `Genre.books` allows a genre to be associated with multiple books.

Modeling these relationships in Prisma felt different from a document database: instead of embedding genre data in every book document, I define related models and connect them with a foreign key. This avoids duplicated genre details and lets the database enforce referential integrity.

## Database Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your PostgreSQL connection using the `DATABASE_URL` environment variable.

3. Apply the committed migrations to the configured PostgreSQL database:

   ```bash
   npx prisma migrate deploy --schema=api/prisma/schema.prisma
   ```

4. Seed the database:

   ```bash
   npx prisma db seed --schema=api/prisma/schema.prisma
   ```

   Set `LIBRARIAN_NAME`, `LIBRARIAN_EMAIL`, and a unique
   `LIBRARIAN_PASSWORD` of at least 16 characters in the repository-root
   `.env` first. The seed upserts this account as a `LIBRARIAN` and stores only
   its bcrypt hash. Re-running the seed resets that account's password to the
   configured value.

5. Open Prisma Studio to view the database:

   ```bash
   npx prisma studio --schema=api/prisma/schema.prisma
   ```

## Backend API

The NestJS application runs from `library-api/` and exposes the catalog and
authentication modules implemented in `api/src/`. Create an uncommitted
`library-api/.env` file containing `DATABASE_URL` and a strong `JWT_SECRET`
(at least 32 random characters) before starting the API:

```bash
cd library-api
npm run start:dev
```

`POST /auth/register` creates a Patron account and returns a JWT;
`POST /auth/login` verifies the bcrypt-hashed password and also returns a JWT.
Send the token as `Authorization: Bearer <token>` to access
`GET /users/profile`. Book creation, updates (`PATCH` or `PUT`), and deletion
require a token for a `LIBRARIAN` account. New accounts are Patrons by default;
grant the Librarian role through a trusted administrative database process.

The public genre routes are `GET /genres` and `GET /genres/:id`. Creating,
updating (`PATCH`/`PUT`), or deleting a genre requires a Librarian token. Books
support corresponding list, detail, create, update, and delete routes.
`GET /books` accepts
`genreId`, `search` (matches title or author), `page`, and `limit` query
parameters. Pagination defaults to page 1 and 10 results, with a maximum
limit of 100.

Import [docs/postman_collection.json](./docs/postman_collection.json) into
Postman for example requests for every API route.