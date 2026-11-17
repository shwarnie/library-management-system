import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';

import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(
    @Query('genreId', new ParseIntPipe({ optional: true })) genreId?: number,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit = 10,
  ) {
    return this.booksService.findAll({ genreId, search, page, limit });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LIBRARIAN)
  create(@Body() data: CreateBookDto) {
    return this.booksService.create(data);
  }

  @Patch(':id')
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LIBRARIAN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBookDto,
  ) {
    return this.booksService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LIBRARIAN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}