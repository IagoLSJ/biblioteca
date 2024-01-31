import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from '../books/books.service';
import { BooksModule } from '../books/books.module';
import { SharedModules } from 'src/shared/shared.module';
import { PaginationService } from 'src/shared/pagination/pagination.service';

@Module({
  imports: [BooksModule, SharedModules],
  controllers: [LibraryController],
  providers: [LibraryService, PrismaService, BooksService, PaginationService],
})
export class LibraryModule {}
