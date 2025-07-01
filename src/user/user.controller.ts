import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ICreateUpdateUsuarioRequest } from './dto/create-update-request.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post()
    async(
        @Body()
        request: ICreateUpdateUsuarioRequest
    ) {
        return this.userService.createUser(request);
    }
}
