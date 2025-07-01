import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './schemas/book.model';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { AuthorModule } from 'src/author/author.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
        AuthorModule
    ],
    controllers: [BookController],
    providers: [BookService]
})
export class BookModule { }
