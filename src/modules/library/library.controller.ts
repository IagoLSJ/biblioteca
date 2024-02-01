import {  Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Request as IRequest } from 'express';

import { PaginateResponseDTO } from 'src/shared/pagination/dto/paginate.response.dto';

import { AuthGuard } from '../auth/auth.guard';

import { LibraryService } from './library.service';

import { ReturnLibraryDTO } from './dto/return.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @UseGuards(AuthGuard)
  @Post('/rent/:id')
  async rent(@Request() request: IRequest, @Param('id') bookId: string): Promise<ReturnLibraryDTO> {
    const userId = request.user.id;
    return await this.libraryService.rent(userId, bookId);
  }

  @UseGuards(AuthGuard)
  @Get('/my-history')
  async findAllHistory(@Request() request: IRequest):Promise<PaginateResponseDTO<ReturnLibraryDTO>>{
    const userId = request.user.id
    return await this.libraryService.findAllHistory(userId);
  }

  @UseGuards(AuthGuard)
  @Put('/devolution/:id')
  async devolution(@Request() request: IRequest, @Param('id') bookId: string): Promise<ReturnLibraryDTO> {
    const userId = request.user.id;
    return await this.libraryService.devolution(userId, bookId);
  }
}
