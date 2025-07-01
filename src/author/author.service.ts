import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schemas/author.model';
import { ICreateUpdateAuthorRequest } from './dto/create-update-request';

@Injectable()
export class AuthorService {
    constructor(
        @InjectModel('Author')
        private readonly authorModel: Model<Author>
    ) { }

    async insertAuthor(request: ICreateUpdateAuthorRequest): Promise<string> {
        const newAuthor = new this.authorModel({
            nombre: request.nombre,
            edad: request.edad
        });

        //validate object before saving
        if (!newAuthor.nombre || newAuthor.nombre.trim() === '') {
            throw new Error('Author name is required');
        }

        const result = await newAuthor.save();
        return result.id as string;
    }
}
