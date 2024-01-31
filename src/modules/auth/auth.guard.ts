import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import {AppError} from '../../shared/errors/app-error'

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly jwtService:JwtService){}
   async canActivate(context: ExecutionContext):  Promise<boolean>  {
       const request = context.switchToHttp().getRequest();

       const token = this.extractTokenFromHeader(request);

       if(!token){
        throw new AppError('Token invalido')
       }

       try {
        const playload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET
        })

        request['user'] = playload
       } catch (error) {
        throw new AppError('Token expired')
       }

       return true;
    }


    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization ?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
    
}