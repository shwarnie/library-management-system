import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany({
      include: {
        _count: { select: { books: true } },
      },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  create(data: CreateGenreDto) {
    return this.prisma.genre.create({ data });
  }

  async update(id: number, data: UpdateGenreDto) {
    await this.findOne(id);

    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.genre.delete({
        where: { id },
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Cannot delete a genre that still has books.',
        );
      }

      throw error;
    }
  }
}