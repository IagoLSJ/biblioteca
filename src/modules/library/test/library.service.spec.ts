import { LibraryService } from '../library.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BooksService } from '../../books/books.service';
import { PaginationService } from 'src/shared/pagination/pagination.service';
import { ReturnLibraryDTO } from '../dto/return.dto';
import { AppError } from 'src/shared/errors/app-error';

describe('LibraryService', () => {
  let libraryService: LibraryService;
  let prismaService: PrismaService;
  let bookService: BooksService;
  let paginationService: PaginationService;

  beforeEach(() => {
    prismaService = new PrismaService();
    paginationService = new PaginationService(prismaService);
    bookService = new BooksService(prismaService, paginationService);
    libraryService = new LibraryService(
      prismaService,
      bookService,
      paginationService,
    );
  });

  describe('rent', () => {
    it('should rent a book and return the rental details', async () => {
      
      const userId = '1';
      const bookId = '1';
      const book = {
        id: bookId,
        title: 'Book Title',
        author: 'Author book',
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const rentalDate = new Date('2024-02-01');
      const createdRent = {
        id: '1',
        usersId: '1',
        booksId: '1',
        rentalDate,
        returnDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedReturnDTO = new ReturnLibraryDTO(
        createdRent.id,
        null,
        book,
        rentalDate,
        null,
        new Date(),
        new Date(),
      );
      
      jest.spyOn(bookService, 'findById').mockResolvedValue(book);
      jest.spyOn(bookService, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(prismaService.rentalHistory, 'create')
        .mockResolvedValue(createdRent);

      
      const result = await libraryService.rent(userId, bookId);

      
      expect(result).toEqual(expectedReturnDTO);
      expect(bookService.findById).toHaveBeenCalledWith(bookId);
      expect(bookService.update).toHaveBeenCalledWith(bookId, {
        availability: false,
      });
      
    });

    it('should throw an AppError if the book is not available', async () => {
      
      const userId = '1';
      const bookId = '1';
      const book = {
        id: bookId,
        title: 'Book Title',
        author: 'Author book',
        availability: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(bookService, 'findById').mockResolvedValue(book);

       
      await expect(libraryService.rent(userId, bookId)).rejects.toThrow(
        AppError,
      );
      expect(bookService.findById).toHaveBeenCalledWith(bookId);
    });
  });

  describe('devolution', () => {
    it('should return a book and update the rental details', async () => {
      
      const userId = 'user1';
      const bookId = 'book1';
      const book = {
        id: bookId,
        title: 'Book Title',
        author: 'Author book',
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const rentalDate = new Date();
      const history = {
        id: '1',
        rentalDate,
      };
      const updatedRent = {
        id: '1',
        usersId: '1',
        booksId: '1',
        rentalDate: new Date(),
        returnDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedReturnDTO = new ReturnLibraryDTO(
        history.id,
        null,
        book,
        rentalDate,
        updatedRent.returnDate,
        rentalDate,
        rentalDate,
      );
      const historyById = {
        id: '1',
        usersId: '1',
        booksId: '1',
        rentalDate: new Date(),
        returnDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(bookService, 'findById').mockResolvedValue(book);
      jest
        .spyOn(prismaService.rentalHistory, 'findFirst')
        .mockResolvedValue(historyById);
      jest
        .spyOn(prismaService.rentalHistory, 'update')
        .mockResolvedValue(updatedRent);
      jest.spyOn(bookService, 'update').mockResolvedValue(undefined);

      
      const result = await libraryService.devolution(userId, bookId);

      
      expect(result).toEqual(expectedReturnDTO);
      expect(bookService.findById).toHaveBeenCalledWith(bookId);
      expect(prismaService.rentalHistory.findFirst).toHaveBeenCalledWith({
        where: {
          usersId: userId,
          booksId: bookId,
        },
      });
      expect(prismaService.rentalHistory.update).toHaveBeenCalledWith({
        where: {
          id: history.id,
        },
        data: {
          returnDate: expect.any(Date),
        },
      });
      expect(bookService.update).toHaveBeenCalledWith(bookId, {
        availability: true,
      });
    });

    it('should throw an AppError if the rental history is not found', async () => {
      
      const userId = 'user1';
      const bookId = 'book1';
      const book = {
        id: bookId,
        title: 'Book Title',
        author: 'Author book',
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(bookService, 'findById').mockResolvedValue(book);
      jest
        .spyOn(prismaService.rentalHistory, 'findFirst')
        .mockResolvedValue(null);

      
      await expect(libraryService.devolution(userId, bookId)).rejects.toThrow(
        AppError,
      );
      expect(bookService.findById).toHaveBeenCalledWith(bookId);
      expect(prismaService.rentalHistory.findFirst).toHaveBeenCalledWith({
        where: {
          usersId: userId,
          booksId: bookId,
        },
      });
    });
  });

  describe('findAllHistory', () => {
    it('should return the paginated rental history with ReturnLibraryDTO', async () => {
      
      const userId = 'user1';
      const rentalHistory = {
        items: [
          {
            id: '1',
            user: null,
            book: null,
            rentalDate: new Date('2024-02-01'),
            returnDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          total: 1,
          perPage: 10,
          page: 1,
          totalPages: 1,
        },
      };
      const expectedResponse = {
        items: [
          new ReturnLibraryDTO(
            rentalHistory.items[0].id,
            rentalHistory.items[0].user,
            rentalHistory.items[0].book,
            rentalHistory.items[0].rentalDate,
            rentalHistory.items[0].returnDate,
            rentalHistory.items[0].createdAt,
            rentalHistory.items[0].updatedAt,
          ),
        ],
        meta: rentalHistory.meta,
      };

      jest
        .spyOn(paginationService, 'paginate')
        .mockResolvedValue(rentalHistory);

      
      const result = await libraryService.findAllHistory(userId);

      
      expect(result).toEqual(expectedResponse);
      expect(paginationService.paginate).toHaveBeenCalledWith(
        'rentalHistory',
        {
          page: 1,
          perPage: 10,
        },
        { usersId: userId },
        { user: true, book: true },
      );
    });
  });
});
