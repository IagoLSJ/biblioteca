import { IsOptional, IsString } from 'class-validator';
export class FilterParamsDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  availability: string;
}
