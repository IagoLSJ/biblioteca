import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BooksModule } from './modules/books/books.module';
import { AuthModule } from './modules/auth/auth.module';
import { LibraryModule } from './modules/library/library.module';

@Module({
  imports: [BooksModule, AuthModule, ConfigModule.forRoot(), LibraryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
