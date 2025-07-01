import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { IGetBook } from './dto/get-book.dto';
import { IUpdateBookRequest } from './dto/update-book-request.dto';

@Controller('book')
export class BookController {
    constructor(private readonly booksService: BookService) { }

    @Post()
    async addBook(
        @Body('title') title: string,
        @Body('description') description: string,
    ) {
        const generatedId = await this.booksService.insertBook(
            title,
            description
        );
        return {
            message: 'Book added successfully', id: generatedId
        }
    }

    @Get(':id')
    async getSingleBook(@Param('id') bookId: string): Promise<IGetBook> {
        return this.booksService.getSingleBook(bookId);
    }

    @Put(':id')
    async updateBook(
        @Body()
        body: IUpdateBookRequest,
        @Param('id')
        bookId: string
    ) {
        return this.booksService.updateAuthor(bookId, body);
    }
}
