import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { Book } from './schemas/book.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose, Schema, Types, ObjectId } from 'mongoose';
import { IGetBook } from './dto/get-book.dto';
import { IUpdateBookRequest } from './dto/update-book-request.dto';
import { Author } from 'src/author/schemas/author.model';
import { AuthorService } from 'src/author/author.service';

@Injectable()
export class BookService {
    constructor(
        @InjectModel('Book')
        private readonly bookModel: Model<Book>,
    ) { }

    async insertBook(title: string, description: string): Promise<string> {
        try {
            const newBook = new this.bookModel({
                title,
                description
            });
            const result = await newBook.save();
            return result.id as string;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((err: any) => err.message);
                throw new BadRequestException(messages.join(', '));
            }
        }
    }

    async getSingleBook(id: string): Promise<IGetBook> {
        const book = await this.findBook(id);
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        let authorData = undefined;
        if (book.author) {
            const authorId = book.author.toString();
            await book.populate<{ author: Author }>('author');
            if (typeof book.author === 'object' && book.author) {
                const { id, nombre, edad } = book.author as unknown as Author;
                authorData = { id, nombre, edad };
            }
            else {
                authorData = {
                    id: authorId,
                }
            }
        }
        return {
            id: book.id,
            title: book.title,
            description: book.description,
            author: authorData ? authorData.nombre : undefined,
            authorId: authorData ? authorData.id : undefined,
        }
    }

    async updateAuthor(id: string, request: IUpdateBookRequest): Promise<IGetBook> {
        try {
            const book = await this.findBook(id);
            if (!book) {
                throw new NotFoundException('Book not found');
            }
            if (request.title) {
                book.title = request.title;
            }
            if (request.description) {
                book.description = request.description;
            }
            if (request.author) {
                book.author = new Types.ObjectId(request.author) as unknown as ObjectId;
            }
            const bookSaved = await book.save();
            return {
                id: bookSaved.id,
                title: bookSaved.title,
                description: bookSaved.description,
                author: bookSaved.author.toString()
            };
        } catch (error) {
            console.log(error);
        }
    }

    private async findBook(id: string): Promise<Book> {
        let book: Book | PromiseLike<Book>;
        try {
            book = await this.bookModel.findById(id);
        } catch (error) {
            throw new NotFoundException('Book not found');
        }
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    }
}
