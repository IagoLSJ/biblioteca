import { Injectable } from "@nestjs/common";
import { compare, genSalt, hash } from "bcrypt";

@Injectable()
export class EncryptoService{
    async createHash(data: string): Promise<string> {
        const salt = await genSalt(10);
        return await hash(data, salt);
      }
    
      async compare(data: string, hash: string): Promise<boolean> {
        return await compare(data, hash);
      }
}