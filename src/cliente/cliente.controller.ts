import { Controller, Get, Param, Request } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './schemas/cliente.schema';
import mongoose from 'mongoose';

@Controller('cliente')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) { }

    @Get()
    async getAllClientes(@Request() req): Promise<Cliente[]> {
        const claims = req.user;
        return this.clienteService.findAll();
    }

    @Get(':id')
    async getCliente(@Param('id') id): Promise<Cliente> {
        return this.clienteService.findClienteById(new mongoose.Types.ObjectId(id));
    }
}
