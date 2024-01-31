import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from '../library.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BooksService } from '../../books/books.service';
import { PaginationService } from 'src/shared/pagination/pagination.service';
import { ReturnLibraryDTO } from '../dto/return.dto';
import { AppError } from 'src/shared/errors/app-error';
import { ReturnBookDTO } from '../../books/dto/return.dto';

describe('LibraryService', () => {
  let service: LibraryService;
  let prismaService: PrismaService;
  let booksService: BooksService;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibraryService, PrismaService, BooksService, PaginationService],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
    prismaService = module.get<PrismaService>(PrismaService);
    booksService = module.get<BooksService>(BooksService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  describe('rent', () => {
    it('should rent a book and create rental history', async () => {
      const userId: string = "a166a83e-c264-45cb-8bcd-ec8cd0c61e03";
      const bookId: string = "00ad0e53-05d5-4a78-b398-556c9c90256c";
      const bookAvailability = true; 
      const rentalDate = new Date().toISOString();

      jest.spyOn(booksService, 'findById').mockResolvedValueOnce(new ReturnBookDTO(
        '13ac70a0-c453-4787-a232-b3635ce52ca7',
        'Auto da compadecida',
        'sndflksn',
        true,
        new Date('2024-01-30T19:42:10.729Z'),
        new Date('2024-01-30T19:42:10.729Z'),
      ));
      jest.spyOn(booksService, 'update').mockResolvedValueOnce(/* mock your updated book */);
      jest.spyOn(prismaService.rentalHistory, 'create').mockResolvedValueOnce({
        id: 'rentalId',
        booksId: bookId,
        usersId: userId,
        rentalDate: new Date(),
      });

      const result = await service.rent(userId, bookId);

      expect(result).toBeInstanceOf(ReturnLibraryDTO);
      expect(result.id).toEqual('rentalId');
      expect(result.book.availability).toBeFalsy();
      expect(result.rentalDate).toEqual(rentalDate);
    });

    it('should throw AppError when trying to rent an unavailable book', async () => {
      const userId: string =  "a166a83e-c264-45cb-8bcd-ec8cd0c61e03";
      const bookId: string = "00ad0e53-05d5-4a78-b398-556c9c90256c";
      const bookAvailability = false;

      jest.spyOn(booksService, 'findById').mockResolvedValueOnce(new ReturnBookDTO(
        '13ac70a0-c453-4787-a232-b3635ce52ca7',
        'Auto da compadecida',
        'sndflksn',
        true,
        new Date('2024-01-30T19:42:10.729Z'),
        new Date('2024-01-30T19:42:10.729Z'),
      ))

      await expect(service.rent(userId, bookId)).rejects.toThrow(AppError);
    });
  });

  describe('devolution', () => {
    it('should return a book, update rental history, and make the book available', async () => {
      const userId: string = "a166a83e-c264-45cb-8bcd-ec8cd0c61e03";
      const bookId: string = "00ad0e53-05d5-4a78-b398-556c9c90256c";
      const rentalId: string = /* mock your rentalId */;
      const returnDate = new Date().toISOString();

      jest.spyOn(booksService, 'findById').mockResolvedValueOnce(/* mock your book */);
      jest.spyOn(prismaService.rentalHistory, 'findFirst').mockResolvedValueOnce({
        id: rentalId,
        booksId: bookId,
        usersId: userId,
        rentalDate: new Date().toISOString(),
      });
      jest.spyOn(booksService, 'update').mockResolvedValueOnce(/* mock your updated book */);
      jest.spyOn(prismaService.rentalHistory, 'update').mockResolvedValueOnce({
        id: rentalId,
        returnDate: returnDate,
      });

      const result = await service.devolution(userId, bookId);

      expect(result).toBeInstanceOf(ReturnLibraryDTO);
      expect(result.id).toEqual(rentalId);
      expect(result.returnDate).toEqual(returnDate);
      expect(result.book.availability).toBeTruthy(); // Book should be available after devolution
    });

    it('should throw AppError when trying to devolve a book without rental history', async () => {
      const userId: string =  "a166a83e-c264-45cb-8bcd-ec8cd0c61e03";
      const bookId: string = "00ad0e53-05d5-4a78-b398-556c9c90256c";

      jest.spyOn(booksService, 'findById').mockResolvedValueOnce(/* mock your book */);
      jest.spyOn(prismaService.rentalHistory, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.devolution(userId, bookId)).rejects.toThrow(AppError);
    });
  });

  describe('findAllHistory', () => {
    it('should return paginated rental history for a user with ReturnLibraryDTO', async () => {
      const userId: string =  "a166a83e-c264-45cb-8bcd-ec8cd0c61e03";
      const paginatedResult: {
        items: ReturnLibraryDTO[];
        meta: { total: number; totalPages: number;  page: number; perPage: number };
      } = {
        items: [{
			"id": "5fa69aa2-1124-4c8e-aaae-14246b4f7e36",
			"user": {
				"id": "a166a83e-c264-45cb-8bcd-ec8cd0c61e03",
				"name": "iago",
				"email": "joseisgolima@gmail.com",
				"token": null,
				"createdAt": "2024-01-30T20:17:52.659Z",
				"updatedAt": "2024-01-30T20:17:52.659Z"
			},
			"book": {
				"id": "00ad0e53-05d5-4a78-b398-556c9c90256c",
				"title": "Auto da compadecida",
				"author": "Iago",
				"availability": true,
				"createdAt": "2024-01-30T19:41:33.116Z",
				"updatedAt": "2024-01-30T21:17:16.320Z"
			},
			"rentalDate": "2024-01-30T20:18:51.769Z",
			"returnDate": "2024-01-30T21:17:15.732Z",
			"createdAt": "2024-01-30T20:18:51.770Z",
			"updatedAt": "2024-01-30T21:17:15.733Z"
		},
		{
			"id": "e0afed97-bfc2-48fd-b5f3-9eef537f92e6",
			"user": {
				"id": "a166a83e-c264-45cb-8bcd-ec8cd0c61e03",
				"name": "iago",
				"email": "joseisgolima@gmail.com",
				"token": null,
				"createdAt": "2024-01-30T20:17:52.659Z",
				"updatedAt": "2024-01-30T20:17:52.659Z"
			},
			"book": {
				"id": "00ad0e53-05d5-4a78-b398-556c9c90256c",
				"title": "Auto da compadecida",
				"author": "Iago",
				"availability": true,
				"createdAt": "2024-01-30T19:41:33.116Z",
				"updatedAt": "2024-01-30T21:17:16.320Z"
			},
			"rentalDate": "2024-01-30T20:18:54.243Z",
			"returnDate": null,
			"createdAt": "2024-01-30T20:18:54.244Z",
			"updatedAt": "2024-01-30T20:18:54.244Z"
		}],
        meta: {
            "total": 2,
            "totalPages": 1,
            "page": 1,
            "perPage": 10
        },
      };

      jest.spyOn(paginationService, 'paginate').mockResolvedValueOnce(paginatedResult);

      const result = await service.findAllHistory(userId);

      expect(result).toEqual(paginatedResult);
    });
  });
});
