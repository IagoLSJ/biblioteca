import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateBookDTO {
    @IsOptional()
    @IsString({message: 'O titulo do livro tem que ser uma string'})
    @IsNotEmpty({message: "O titulo não pode ser um campo vazio e nem nulo"})
    title:string

    @IsOptional()
    @IsString({message: 'O author do livro tem que ser uma string'})
    @IsNotEmpty({message: "O author não pode ser um campo vazio e nem nulo"})
    author:string

    @IsOptional()
    @IsBoolean({message: 'O availability  tem que ser um boolean'})
    @IsNotEmpty({message: "O availability não pode ser um campo vazio e nem nulo"})
    availability:boolean
}