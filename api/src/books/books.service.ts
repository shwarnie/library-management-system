import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    genreId,
    search,
    page = 1,
    limit = 10,
  }: {
    genreId?: number;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) {
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('limit must be between 1 and 100');
    }

    const where: Prisma.BookWhereInput = {};
    if (genreId !== undefined) {
      where.genreId = genreId;
    }
    if (search?.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { author: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    return this.prisma.book.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
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