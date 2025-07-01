import { Body, Controller, Post } from '@nestjs/common';
import { AuthorService } from './author.service';
import { ICreateUpdateAuthorRequest } from './dto/create-update-request';

@Controller('author')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) { }

    @Post()
    async addAuthor(
        @Body()
        body: ICreateUpdateAuthorRequest
    ) {
        const generatedId = await this.authorService.insertAuthor(body);
        return {
            message: 'Author added successfully', id: generatedId
        }
    }
}
