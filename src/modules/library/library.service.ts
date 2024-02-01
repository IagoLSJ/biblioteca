import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from '../books/books.service';

import { PaginationService } from 'src/shared/pagination/pagination.service';
import { PaginateResponseDTO } from 'src/shared/pagination/dto/paginate.response.dto';
import { ReturnLibraryDTO } from './dto/return.dto';
import { AppError } from 'src/shared/errors/app-error';
@Injectable()
export class LibraryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookService: BooksService,
    private readonly pagination: PaginationService,
  ) {}

  async rent(userId: string, bookId: string): Promise<ReturnLibraryDTO> {
    const bookById = await this.bookService.findById(bookId);
    if (bookById.availability == false) {
      throw new AppError(
        'Não e possivel alugar um livro que não esta disponivel',
      );
    }
    await this.bookService.update(bookById.id, {
      availability: false,
    });
    const createdRent = await this.prismaService.rentalHistory.create({
      data: {
        booksId: bookById.id,
        usersId: userId,
        rentalDate: new Date(),
      },
    });

    return new ReturnLibraryDTO(
      createdRent.id,
      null,
      bookById,
      createdRent.rentalDate,
      createdRent.returnDate,
      createdRent.createdAt,
      createdRent.updatedAt,
    );
  }

  async devolution(userId: string, bookId: string): Promise<ReturnLibraryDTO> {
    const bookById = await this.bookService.findById(bookId);

    const historyById = await this.prismaService.rentalHistory.findFirst({
      where: {
        usersId: userId,
        booksId: bookById.id,
      },
    });
    if (!historyById) {
      throw new AppError('Historico não encontrado');
    }
    const updatedRent = await this.prismaService.rentalHistory.update({
      where: {
        id: historyById.id,
      },
      data: {
        returnDate: new Date(),
      },
    });

    await this.bookService.update(bookById.id, {
      availability: true,
    });

    return new ReturnLibraryDTO(
      historyById.id,
      null,
      bookById,
      updatedRent.rentalDate,
      updatedRent.returnDate,
      updatedRent.createdAt,
      updatedRent.updatedAt,
    );
  }

  async findAllHistory(
    userId: string,
  ): Promise<PaginateResponseDTO<ReturnLibraryDTO>> {
    const where = {
      usersId: userId,
    };
    const { items, meta } = await this.pagination.paginate(
      'rentalHistory',
      {
        page: 1,
        perPage: 10,
      },
      where,
      { user: true, book: true },
    );
    const itemsWithReturnDTO = items.map((item: ReturnLibraryDTO) => {
      return new ReturnLibraryDTO(
        item.id,
        item.user,
        item.book,
        item.rentalDate,
        item.returnDate,
        item.createdAt,
        item.updatedAt,
      );
    });
    return { items: itemsWithReturnDTO, meta };
  }
}
