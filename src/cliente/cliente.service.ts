import { Injectable } from '@nestjs/common';
import { Cliente } from './schemas/cliente.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class ClienteService {
    constructor(
        @InjectModel(Cliente.name)
        private clienteModel: mongoose.Model<Cliente>
    ) { }

    async findAll(usuarioId: mongoose.Types.ObjectId): Promise<Cliente[]> {
        const clientes = await this.clienteModel.find({ usuario: usuarioId }).exec();
        return clientes;
    }

    async findClienteById(id: mongoose.Types.ObjectId): Promise<Cliente> {
        const cliente = await this.clienteModel.findById(id).exec();
        return cliente;
    }
}
