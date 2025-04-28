import { Controller, Get, Header, Param, Req, UseGuards } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './schemas/cliente.schema';
import mongoose from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('cliente')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) { }

    @Get()
    @Header('Access-Control-Allow-Credentials', 'true')
    @UseGuards(AuthGuard('jwt'))
    async getAllClientes(@Req() req): Promise<Cliente[]> {
        const claims = req.user;
        return this.clienteService.findAll(new mongoose.Types.ObjectId(claims.user._id));
    }

    @Get(':id')
    async getCliente(@Param('id') id): Promise<Cliente> {
        return this.clienteService.findClienteById(new mongoose.Types.ObjectId(id));
    }
}
