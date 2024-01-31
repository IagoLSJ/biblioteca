import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/shared/errors/app-error';
import { EncryptoService } from '../../shared/libs/encryptor/encryptor.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDTO } from './dto/signIn.dto';
import { SignUpDTO } from './dto/singUp.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encrypto: EncryptoService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(signIn: SignInDTO) {
    const userByEmail = await this.prismaService.user.findFirst({
      where: {
        email: signIn.email,
      },
    });

    if (!userByEmail) {
      throw new AppError('Email/password incorretos');
    }

    const macth = await this.encrypto.compare(
      signIn.password,
      userByEmail.passwordHash,
    );

    if (!macth) {
      throw new AppError('Email/password incorretos');
    }
    const playload = {
      id: userByEmail.id
    }
   const token =  this.jwtService.sign(playload)

    return {token}
  }

  async signUp(signUp: SignUpDTO){
    const existEmail = await this.prismaService.user.findFirst({
      where:{
        email: signUp.email
      }
    })

    if(existEmail){
      throw new AppError('Email não disponivel')
    }

    const hashedPassword = await this.encrypto.createHash(signUp.password)

    const createdUser = await this.prismaService.user.create({
      data:{
        email:signUp.email,
        name: signUp.name,
        passwordHash: hashedPassword
      }
    })
    delete createdUser.passwordHash
   return createdUser
  }
}
