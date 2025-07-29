import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { AuthGuard } from '@nestjs/passport';
import { IGenericResponse } from 'src/types/general';
import { CreateSocketDto } from './dto/create-socket.dto';

@Controller('sockets')
export class SocketsController {
    constructor(private readonly socketsService: SocketsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async save(
        @Req() req,
        @Body() socket: CreateSocketDto
    ): Promise<IGenericResponse> {
        return await this.socketsService.save(socket.connectionId, req.user.user._id);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    async delete(
        @Req() req
    ): Promise<IGenericResponse> {
        return await this.socketsService.deleteAllSockets(req.user.user._id);
    }
}
