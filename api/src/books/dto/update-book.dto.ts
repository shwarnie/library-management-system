export class CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  totalCopies?: number;
  availableCopies?: number;
  genreId: number;
}