import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create four genres
  const genres = [
    { name: 'Fiction', slug: 'fiction' },
    { name: 'Science', slug: 'science' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Biography', slug: 'biography' },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: { name: genre.name },
      create: genre,
    });
  }

  // 2. Get the genres from the database
  const savedGenres = await prisma.genre.findMany();

  const genreIds = Object.fromEntries(
    savedGenres.map((genre) => [genre.slug, genre.id]),
  );

  // 3. Create 15 books
  const books = [
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', genre: 'fiction' },
    { title: 'The River Between', author: 'Ngugi wa Thiong’o', isbn: '9780435905484', genre: 'fiction' },
    { title: 'Animal Farm', author: 'George Orwell', isbn: '9780451526342', genre: 'fiction' },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', genre: 'fiction' },

    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', genre: 'science' },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: '9780345539434', genre: 'science' },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '9780198788607', genre: 'science' },
    { title: 'The Gene', author: 'Siddhartha Mukherjee', isbn: '9781476733524', genre: 'science' },

    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', genre: 'technology' },
    { title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '9780135957059', genre: 'technology' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262046305', genre: 'technology' },
    { title: 'The Innovators', author: 'Walter Isaacson', isbn: '9781476708690', genre: 'technology' },

    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', genre: 'biography' },
    { title: 'Steve Jobs', author: 'Walter Isaacson', isbn: '9781451648539', genre: 'biography' },
    { title: 'Becoming', author: 'Michelle Obama', isbn: '9781524763138', genre: 'biography' },
  ];

  // 4. Save books and connect each to its genre
  for (const book of books) {
    const { genre, ...bookData } = book;

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        ...bookData,
        genreId: genreIds[genre],
      },
      create: {
        ...bookData,
        genreId: genreIds[genre],
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Genres created: ${savedGenres.length}`);
  console.log(`Books processed: ${books.length}`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });