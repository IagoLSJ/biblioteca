import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../books.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationService } from 'src/shared/pagination/pagination.service';
import { AppError } from '../../../shared/errors/app-error';
import { CreateBookDTO } from '../dto/create.dto';
import { UpdateBookDTO } from '../dto/update.dto';
import { ReturnBookDTO } from '../dto/return.dto';
import { FilterParamsDTO } from '../dto/filter.params.dto';
import { PaginateResponseDTO } from 'src/shared/pagination/dto/paginate.response.dto';
import { PaginationOptions } from 'src/shared/pagination/dto/pagination.options.interface';

describe('BooksService', () => {
  let service: BooksService;
  let prismaService: PrismaService;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, PrismaService, PaginationService],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prismaService = module.get<PrismaService>(PrismaService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  describe('findAll', () => {
    it('should return paginated books with ReturnBookDTO', async () => {
      const filterParamsDTO: FilterParamsDTO = {author:'', availability: '', title: ''};
      const paginateOptions: PaginationOptions = { page: 1, perPage: 3 };
      const paginatedResult: PaginateResponseDTO<ReturnBookDTO> = {
        items: [
          {
            id: '13ac70a0-c453-4787-a232-b3635ce52ca7',
            title: 'Auto da compadecida',
            author: 'sndflksn',
            availability: true,
            createdAt: new Date('2024-01-30T19:42:10.729Z'),
            updatedAt: new Date('2024-01-30T19:42:10.729Z'),
          },
          {
            id: '13ac70a0-c453-4787-a232-b3635ce52ca7',
            title: 'Auto da compadecida',
            author: 'sndflksn',
            availability: true,
            createdAt: new Date('2024-01-30T19:42:10.729Z'),
            updatedAt: new Date('2024-01-30T19:42:10.729Z'),
          },
          {
            id: '13ac70a0-c453-4787-a232-b3635ce52ca7',
            title: 'Auto da compadecida',
            author: 'sndflksn',
            availability: true,
            createdAt: new Date('2024-01-30T19:42:10.729Z'),
            updatedAt: new Date('2024-01-30T19:42:10.729Z'),
          },
        ],
        meta: {
          total: 38,
          totalPages: 10,
          page: 1,
          perPage: 3,
        },
      };

      jest
        .spyOn(paginationService, 'paginate')
        .mockResolvedValueOnce(paginatedResult);

      const result = await service.findAll(filterParamsDTO, paginateOptions);

      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('should return a book by ID', async () => {
      const bookId: string = '13ac70a0-c453-4787-a232-b3635ce52ca7';
      const foundBook: ReturnBookDTO = new ReturnBookDTO(
        '13ac70a0-c453-4787-a232-b3635ce52ca7',
        'Auto da compadecida',
        'sndflksn',
        true,
        new Date('2024-01-30T19:42:10.729Z'),
        new Date('2024-01-30T19:42:10.729Z'),
      );

      jest
        .spyOn(prismaService.book, 'findFirst')
        .mockResolvedValueOnce(foundBook);

      const result = await service.findById(bookId);

      expect(result).toEqual(foundBook);
    });

    it('should throw an AppError if book is not found', async () => {
      const bookId: string = '13ac70a0-c453-4787-a232-b3635ce52cb7';

      jest.spyOn(prismaService.book, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.findById(bookId)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a book and return it with ReturnBookDTO', async () => {
      const createBookDto: CreateBookDTO = {
        title: 'Auto da compadecida',
        author: 'sndflksn',
        availability: true,
      };
      const createdBook: ReturnBookDTO = new ReturnBookDTO(
        '13ac70a0-c453-4787-a232-b3635ce52ca7',
        'Auto da compadecida',
        'sndflksn',
        true,
        new Date('2024-01-30T19:42:10.729Z'),
        new Date('2024-01-30T19:42:10.729Z'),
      );

      jest
        .spyOn(prismaService.book, 'create')
        .mockResolvedValueOnce(createdBook);

      const result = await service.create(createBookDto);

      expect(result).toEqual(createdBook);
    });
  });

  describe('update', () => {
    it('should update a book and return it with ReturnBookDTO', async () => {
      const bookId: string = '13ac70a0-c453-4787-a232-b3635ce52ca7';
      const bookById: ReturnBookDTO = new ReturnBookDTO(
        '13ac70a0-c453-4787-a232-b3635ce52ca7',
        'Auto da compadecida',
        'sndflksn',
        true,
        new Date('2024-01-30T19:42:10.729Z'),
        new Date('2024-01-30T19:42:10.729Z'),
      );

      const updateBookDto: Partial<UpdateBookDTO> = { author: 'Iago' };
      const updatedBook: ReturnBookDTO = new ReturnBookDTO(
        '13ac70a0-c453-4787-a232-b3635ce52ca7',
        'Auto da compadecida',
        'Iago',
        true,
        new Date('2024-01-30T19:42:10.729Z'),
        new Date('2024-01-30T19:42:10.729Z'),
      );

      jest.spyOn(service, 'findById').mockResolvedValueOnce(bookById);
      jest
        .spyOn(prismaService.book, 'update')
        .mockResolvedValueOnce(updatedBook);

      const result = await service.update(bookId, updateBookDto);

      expect(result).toEqual(updatedBook);
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      const bookId: string = '13ac70a0-c453-4787-a232-b3635ce52ca7';

      jest.spyOn(prismaService.book, 'delete').mockResolvedValueOnce(undefined);

      await expect(service.delete(bookId)).resolves.not.toThrow();
    });
  });
});
