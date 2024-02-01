import { PaginationOptions } from 'src/shared/pagination/dto/pagination.options.interface';
import { PaginationService } from 'src/shared/pagination/pagination.service';
import { AppError } from 'src/shared/errors/app-error';

import { FilterParamsDTO } from '../dto/filter.params.dto';
import { CreateBookDTO } from '../dto/create.dto';
import { UpdateBookDTO } from '../dto/update.dto';
import { ReturnBookDTO } from '../dto/return.dto';

import { PrismaService } from '../../prisma/prisma.service';
import { BooksService } from '../books.service';

describe('BooksService', () => {
  let booksService: BooksService;
  let prismaService: PrismaService;
  let paginationService: PaginationService;

  beforeEach(() => {
    prismaService = new PrismaService();
    paginationService = new PaginationService(prismaService);
    booksService = new BooksService(prismaService, paginationService);
  });

  describe('findAll', () => {
    it('should return a PaginateResponseDTO of ReturnBookDTOs', async () => {
      
      const filterParamsDTO: FilterParamsDTO = {author: '', availability: '', title: ''};
      const paginateOptions: PaginationOptions = {page: 1, perPage: 10};

      const expectedItems: ReturnBookDTO[] = [
        new ReturnBookDTO('1', 'Book 1', 'Author 1', true, new Date(), new Date()),
        new ReturnBookDTO('2', 'Book 2', 'Author 2', false, new Date(), new Date()),
      ];
      const expectedMeta = { total: 2, perPage: 1, page: 1 , totalPages: 1};

      jest.spyOn(paginationService, 'paginate').mockResolvedValueOnce({ items: expectedItems, meta: expectedMeta });

      
      const result = await booksService.findAll(filterParamsDTO, paginateOptions);

      
      expect(result).toEqual({ items: expectedItems, meta: expectedMeta });
      expect(paginationService.paginate).toHaveBeenCalledWith('book', paginateOptions, filterParamsDTO);
    });
  });

  describe('findById', () => {
    it('should return a ReturnBookDTO if book exists', async () => {
      
      const id = '1';
      const expectedBook: ReturnBookDTO = new ReturnBookDTO('1', 'Book 1', 'Author 1', true, new Date(), new Date());

      jest.spyOn(prismaService.book, 'findFirst').mockResolvedValueOnce(expectedBook);

      
      const result = await booksService.findById(id);

      
      expect(result).toEqual(expectedBook);
      expect(prismaService.book.findFirst).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw an AppError if book does not exist', async () => {
      
      const id = '1';

      jest.spyOn(prismaService.book, 'findFirst').mockResolvedValueOnce(null);

       
      await expect(booksService.findById(id)).rejects.toThrow(AppError);
      expect(prismaService.book.findFirst).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('create', () => {
    it('should create a new book and return a ReturnBookDTO', async () => {
      
      const createBookDto: CreateBookDTO = { title: 'Book 1', author: 'Author 1', availability: true };
      const expectedBook: ReturnBookDTO = new ReturnBookDTO('1', 'Book 1', 'Author 1', true, new Date(), new Date());

      jest.spyOn(prismaService.book, 'create').mockResolvedValueOnce(expectedBook);

      
      const result = await booksService.create(createBookDto);

      
      expect(result).toEqual(expectedBook);
      expect(prismaService.book.create).toHaveBeenCalledWith({ data: createBookDto });
    });
  });

  describe('update', () => {
    it('should update an existing book and return a ReturnBookDTO', async () => {
      
      const id = '1';
      const updateBookDTO: Partial<UpdateBookDTO> = { title: 'Updated Book 1' };
      const expectedBook: ReturnBookDTO = new ReturnBookDTO('1', 'Updated Book 1', 'Author 1', true, new Date(), new Date());

      jest.spyOn(booksService, 'findById').mockResolvedValueOnce(expectedBook);
      jest.spyOn(prismaService.book, 'update').mockResolvedValueOnce(expectedBook);

      
      const result = await booksService.update(id, updateBookDTO);

      
      expect(result).toEqual(expectedBook);
      expect(booksService.findById).toHaveBeenCalledWith(id);
      expect(prismaService.book.update).toHaveBeenCalledWith({ data: updateBookDTO, where: { id } });
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      const id = '1';

      jest.spyOn(booksService, 'findById').mockResolvedValueOnce(new ReturnBookDTO('1', 'Book 1', 'Author 1', true, new Date(), new Date()));
      jest.spyOn(prismaService.book, 'delete').mockResolvedValueOnce(new ReturnBookDTO('1', 'Book 1', 'Author 1', true, new Date(), new Date()));

      await booksService.delete(id);

      expect(booksService.findById).toHaveBeenCalledWith(id);
      expect(prismaService.book.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});