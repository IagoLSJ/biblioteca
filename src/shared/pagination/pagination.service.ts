import { Injectable } from '@nestjs/common';

import { PaginationOptions } from './dto/pagination.options.interface'
import { PaginateResponseDTO } from './dto/paginate.response.dto';

import { IMetadata } from './dto/metadata.interface';

import { PrismaService } from '../../modules/prisma/prisma.service';
@Injectable()
export class PaginationService {
  constructor(private readonly prismaService: PrismaService) {}

  async paginate<PaginateObject>(
    model: string,
    options:PaginationOptions,
    where?: Record<string, any>, 
    include?: Record<string, any> 
  ): Promise<PaginateResponseDTO<PaginateObject>> {
    where = this.prepareCaseInsensitiveConditions(where);
    const {page = 1, perPage = 10}= options
  
    const skip = (Number(page) - 1) * Number(perPage);
    const items = await this.prismaService[model].findMany({
      take: Number(perPage),
      skip,
      where,
      include,
    });

    const total = await this.prismaService[model].count();

    const totalPages = Math.ceil(total / Number(perPage));
    const meta: IMetadata = {
      total,
      totalPages,
      page: Number(page),
      perPage: Number(perPage),
    };
    return {
      items,
      meta,
    };
  }

  private prepareCaseInsensitiveConditions(where?: Record<string, any>): Record<string, any> {
    if (!where) return where;
  
    const caseInsensitiveWhere: Record<string, any> = {};
    Object.keys(where).forEach((key) => {
      caseInsensitiveWhere[key] = { contains: where[key], mode: 'insensitive' };
    });

    return caseInsensitiveWhere;
  }
}
