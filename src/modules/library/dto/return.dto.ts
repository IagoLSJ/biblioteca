import { ReturnBookDTO } from '../../books/dto/return.dto';
import { ReturnUserDTO } from '../../auth/dto/retunr.user.dto';
export class ReturnLibraryDTO {
  id: string;
  user: ReturnUserDTO;
  book: ReturnBookDTO;
  rentalDate: Date;
  returnDate: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    user: ReturnUserDTO,
    book: ReturnBookDTO,
    rentalDate: Date,
    returnDate: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.user =
      user &&
      new ReturnUserDTO(
        user.id,
        user.name,
        user.email,
        null,
        user.createdAt,
        user.updatedAt,
      );
    this.book =
      book &&
      new ReturnBookDTO(
        book.id,
        book.title,
        book.author,
        book.availability,
        book.createdAt,
        book.updatedAt,
      );
    this.rentalDate = rentalDate;
    this.returnDate = returnDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
