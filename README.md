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

5. Open Prisma Studio to view the database:

   ```bash
   npx prisma studio --schema=api/prisma/schema.prisma
   ```