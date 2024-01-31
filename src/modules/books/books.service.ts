import { Injectable } from '@nestjs/common';

import { AppError } from '../../shared/errors/app-error';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from 'src/shared/pagination/pagination.service';

import { CreateBookDTO } from './dto/create.dto';
import { UpdateBookDTO } from './dto/update.dto';
import { ReturnBookDTO } from './dto/return.dto';
import { FilterParamsDTO } from './dto/filter.params.dto';
import { PaginateResponseDTO } from 'src/shared/pagination/dto/paginate.response.dto';
import { PaginationOptions } from 'src/shared/pagination/dto/pagination.options.interface';

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  async findAll(
    filterParamsDTO: FilterParamsDTO,
    paginateOptions:PaginationOptions
  ): Promise<PaginateResponseDTO<ReturnBookDTO>> {
    
    const { items, meta } = await this.pagination.paginate('book', paginateOptions, filterParamsDTO);
    const itemsWithReturnDTO = items.map((item: ReturnBookDTO) => {
     return new ReturnBookDTO(
        item.id,
        item.title,
        item.author,
        item.availability,
        item.createdAt,
        item.updatedAt,
      );
    });
    return { items: itemsWithReturnDTO, meta };
  }
  async findById(id: string): Promise<ReturnBookDTO> {
    const bookById: ReturnBookDTO = await this.prismaService.book.findFirst({
      where: {
        id,
      },
    });

    if (!bookById) {
      throw new AppError('Livro não existe');
    }

    return bookById;
  }

  async create(createBookDto: CreateBookDTO): Promise<ReturnBookDTO> {
    const createdBook: ReturnBookDTO = await this.prismaService.book.create({
      data: createBookDto,
    });

    return createdBook;
  }

  async update(
    id: string,
    updateBookDTO: Partial<UpdateBookDTO>,
  ): Promise<ReturnBookDTO> {
    const bookById = await this.findById(id);

    const updatedBook: ReturnBookDTO = await this.prismaService.book.update({
      data: updateBookDTO,
      where: {
        id,
      },
    });

    return updatedBook;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.book.delete({
      where: {
        id,
      },
    });
  }
}
