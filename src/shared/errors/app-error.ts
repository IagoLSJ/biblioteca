export class AppError extends Error {
  public readonly statusCode: number;
  public readonly badFilds: string[] | undefined;

  constructor(message: string, statusCode = 400, badFilds?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.badFilds = badFilds;
  }
}
