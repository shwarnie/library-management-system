import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PrismaService } from '../prisma/prisma.service.js';

interface AuthenticatedRequest {
  user: { userId: number; email: string; role: Role };
}

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() request: AuthenticatedRequest) {
    const user = await this.prisma.user.findUnique({
      where: { id: request.user.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}