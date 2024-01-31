import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { BooksService } from './books.service';

import { CreateBookDTO } from './dto/create.dto';
import { UpdateBookDTO } from './dto/update.dto';
import { ReturnBookDTO } from './dto/return.dto';
import { FilterParamsDTO } from './dto/filter.params.dto';
import { PaginateResponseDTO } from 'src/shared/pagination/dto/paginate.response.dto';
import { PaginationOptions } from 'src/shared/pagination/dto/pagination.options.interface';


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(
    @Query() filterParamsDTO: FilterParamsDTO,
    @Query() paginationOptions: PaginationOptions,
  ): Promise<PaginateResponseDTO<ReturnBookDTO>> {
    return await this.booksService.findAll(filterParamsDTO, paginationOptions);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ReturnBookDTO> {
    return await this.booksService.findById(id);
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDTO): Promise<ReturnBookDTO> {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateBookDto: Partial<UpdateBookDTO>,
  ): Promise<ReturnBookDTO> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<void> {
    return await this.booksService.delete(id);
  }
}
