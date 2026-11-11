import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.book.findMany({
      include: { genre: true },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async create(data: CreateBookDto) {
    return this.prisma.book.create({
      data,
      include: { genre: true },
    });
  }

  async update(id: number, data: UpdateBookDto) {
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id },
      data,
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}