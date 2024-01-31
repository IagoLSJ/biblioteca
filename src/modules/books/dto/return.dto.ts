export class ReturnBookDTO {
  id: string;
  title: string;
  author: string;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    author: string,
    availability: boolean,
    createdAt: Date,
    updatedAt: Date,
  ){
    this.id = id,
    this.title = title,
    this.author = author,
    this.availability = availability,
    this.createdAt = createdAt,
    this.updatedAt = updatedAt
  }
}
