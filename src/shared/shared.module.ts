import { Module } from '@nestjs/common';
import { EncryptoService } from './libs/encryptor/encryptor.service';
import { PaginationService } from './pagination/pagination.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [EncryptoService, PaginationService, PrismaService],
  exports: [EncryptoService, PaginationService],
})
export class SharedModules {}
