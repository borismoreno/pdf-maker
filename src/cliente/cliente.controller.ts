import { Body, Controller, Delete, Get, Header, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import mongoose from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientDto } from './dto/get-client.dto';
import { Response } from 'express';

@Controller('cliente')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllClientes(@Req() req): Promise<GetClientDto[]> {
        const claims = req.user;
        return this.clienteService.findAll(new mongoose.Types.ObjectId(claims.user._id));
    }

    @Get(':id')
    async getCliente(@Param('id') id): Promise<GetClientDto> {
        return this.clienteService.findClienteById(new mongoose.Types.ObjectId(id));
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async saveCliente(@Req() req, @Body() createClienteDto: CreateClientDto): Promise<GetClientDto> {
        return this.clienteService.save(createClienteDto, req.user.user._id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateCliente(
        @Param('id') id,
        @Req() req,
        @Body() updateClienteDto: CreateClientDto
    ): Promise<GetClientDto> {
        return this.clienteService.update(updateClienteDto, new mongoose.Types.ObjectId(id), req.user.user._id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteCliente(
        @Param('id') id,
        @Req() req,
        @Res() response: Response,
    ) {
        return response.status(204).send(this.clienteService.delete(new mongoose.Types.ObjectId(id), req.user.user._id));
    }
}
