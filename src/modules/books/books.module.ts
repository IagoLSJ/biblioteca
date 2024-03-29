import { Module } from '@nestjs/common';

import { SharedModules } from 'src/shared/shared.module';
import { PaginationService } from 'src/shared/pagination/pagination.service';

import { BooksController } from './books.controller';

import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from './books.service';

@Module({
  imports: [SharedModules],
  controllers: [BooksController],
  providers: [BooksService, PrismaService, PaginationService],
  exports: [BooksService]
})
export class BooksModule {}
