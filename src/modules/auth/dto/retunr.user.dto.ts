export class ReturnUserDTO {
  id: string;
  name: string;
  email: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    token: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
