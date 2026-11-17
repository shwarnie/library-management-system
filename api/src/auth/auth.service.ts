import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const password = await bcrypt.hash(data.password, 12);

    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password,
          role: Role.PATRON,
        },
        select: publicUserSelect,
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('An account with this email already exists');
      }

      throw error;
    }

    return this.issueToken(user);
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  private async issueToken(user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: accessToken, user };
  }
}
