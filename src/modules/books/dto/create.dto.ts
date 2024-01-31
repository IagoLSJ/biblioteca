import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateBookDTO {
    @IsString({message: 'O titulo do livro tem que ser uma string'})
    @IsNotEmpty({message: "O titulo não pode ser um campo vazio e nem nulo"})
    title:string

    @IsString({message: 'O author do livro tem que ser uma string'})
    @IsNotEmpty({message: "O author não pode ser um campo vazio e nem nulo"})
    author:string

    @IsBoolean({message: 'O availability tem que ser um boolean'})
    @IsNotEmpty({message: "O availability não pode ser um campo vazio e nem nulo"})
    availability:boolean
}
