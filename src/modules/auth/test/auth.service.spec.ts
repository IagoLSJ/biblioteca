import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/shared/errors/app-error';
import { EncryptoService } from 'src/shared/libs/encryptor/encryptor.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';
import { SignInDTO } from '../dto/signIn.dto';
import { SignUpDTO } from '../dto/singUp.dto';
import { ReturnUserDTO } from '../dto/retunr.user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let encryptoService: EncryptoService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        EncryptoService,
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    encryptoService = module.get<EncryptoService>(EncryptoService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should throw an error if user does not exist', async () => {
      const signIn: SignInDTO = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(authService.signIn(signIn)).rejects.toThrow(AppError);
      await expect(authService.signIn(signIn)).rejects.toThrow('Email/password incorretos');
    });

    it('should throw an error if password does not match', async () => {
      const signIn: SignInDTO = {
        email: 'test@example.com',
        password: 'password',
      };

      const user = {
        id: '1',
        name: 'username',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);
      jest.spyOn(encryptoService, 'compare').mockResolvedValue(false);

      await expect(authService.signIn(signIn)).rejects.toThrow(AppError);
      await expect(authService.signIn(signIn)).rejects.toThrow('Email/password incorretos');
    });

    it('should return a token if sign in is successful', async () => {
      const signIn: SignInDTO = {
        email: 'test@example.com',
        password: 'password',
      };

      const user = {
        id: '1',
        name: 'username',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);
      jest.spyOn(encryptoService, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await authService.signIn(signIn);

      expect(result).toEqual({ token: 'token' });
    });
  });

  describe('signUp', () => {
    it('should throw an error if email already exists', async () => {
      const signUp: SignUpDTO = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };
      const user = {
        id: '1',
        name: 'username',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);

      await expect(authService.signUp(signUp)).rejects.toThrow(AppError);
      await expect(authService.signUp(signUp)).rejects.toThrow('Email não disponivel');
    });

    it('should create a new user if email does not exist', async () => {
      
      const signUpDTO: SignUpDTO = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const createdUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(encryptoService, 'createHash').mockResolvedValue('hashedPassword');
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      
      const result = await authService.signUp(signUpDTO);

      
      expect(result).toEqual(
        new ReturnUserDTO(
          createdUser.id,
          createdUser.name,
          createdUser.email,
          null,
          createdUser.createdAt,
          createdUser.updatedAt
        )
      );
  });
});
})