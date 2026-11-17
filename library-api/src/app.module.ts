import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PrismaModule } from '../../api/src/prisma/prisma.module.js';
import { AuthModule } from '../../api/src/auth/auth.module.js';
import { BooksModule } from '../../api/src/books/books.module.js';
import { GenresModule } from '../../api/src/genres/genres.module.js';
import { UsersModule } from '../../api/src/users/users.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'library-api',
    }),
    PrismaModule,
    AuthModule,
    BooksModule,
    GenresModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}