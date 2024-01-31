import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SharedModules } from 'src/shared/shared.module';

import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import {AuthGuard} from './auth.guard'

@Module({
  imports: [SharedModules, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.EXPIERS_IN },
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthGuard],
  exports: [AuthGuard]

})
export class AuthModule {}
