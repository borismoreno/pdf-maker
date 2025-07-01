import { Injectable } from '@nestjs/common';
import { Cliente } from './schemas/cliente.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { GeneralService } from 'src/general/general.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientDto } from './dto/get-client.dto';

@Injectable()
export class ClienteService {
    constructor(
        @InjectModel(Cliente.name)
        private clienteModel: mongoose.Model<Cliente>,
        private generalService: GeneralService,
    ) { }

    async findAll(usuarioId: mongoose.Types.ObjectId): Promise<GetClientDto[]> {
        const clientes = await this.clienteModel.find({ usuario: usuarioId }).exec();
        const clientesConTipoIdentificacion = await Promise.all(
            clientes.map(async (cliente) => {
                const tipoIdentificacion = await this.generalService.getTipoIdentificacionById(cliente.tipoIdentificacion);
                const clienteDto: GetClientDto = {
                    _id: cliente._id.toString(),
                    activo: cliente.activo,
                    razonSocial: cliente.razonSocial,
                    tipoIdentificacion: tipoIdentificacion ? tipoIdentificacion.codigo : '',
                    numeroIdentificacion: cliente.numeroIdentificacion,
                    telefono: cliente.telefono,
                    mail: cliente.mail,
                    direccion: cliente.direccion,
                }
                return clienteDto;
            })
        );
        return clientesConTipoIdentificacion;
    }

    async getClienteByIdentificacion(identificacion: string): Promise<GetClientDto> {
        const cliente = await this.clienteModel.findOne({ numeroIdentificacion: identificacion }).exec();
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }
        const tipoIdentificacion = await this.generalService.getTipoIdentificacionById(cliente.tipoIdentificacion);
        return {
            _id: cliente._id.toString(),
            activo: cliente.activo,
            razonSocial: cliente.razonSocial,
            tipoIdentificacion: tipoIdentificacion.codigo,
            numeroIdentificacion: cliente.numeroIdentificacion,
            telefono: cliente.telefono,
            mail: cliente.mail,
            direccion: cliente.direccion,
        };
    }

    async findClienteById(id: mongoose.Types.ObjectId): Promise<GetClientDto> {
        const cliente = await this.clienteModel.findById(id).exec();
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }
        const tipoIdentificacion = await this.generalService.getTipoIdentificacionById(cliente.tipoIdentificacion);
        return {
            _id: cliente._id.toString(),
            activo: cliente.activo,
            razonSocial: cliente.razonSocial,
            tipoIdentificacion: tipoIdentificacion.codigo,
            numeroIdentificacion: cliente.numeroIdentificacion,
            telefono: cliente.telefono,
            mail: cliente.mail,
            direccion: cliente.direccion,
        };
    }

    async save(clienteCrearDto: CreateClientDto, usuarioId: string): Promise<GetClientDto> {
        const cliente = new this.clienteModel(clienteCrearDto);
        cliente.usuario = new mongoose.Types.ObjectId(usuarioId);
        const tipoIdentificacionSave = await this.generalService.getTipoIdentificacionByCodigo(clienteCrearDto.tipoIdentificacion);
        cliente.tipoIdentificacion = tipoIdentificacionSave._id as string;
        cliente.activo = true;
        await cliente.save();
        return {
            _id: cliente._id.toString(),
            activo: cliente.activo,
            razonSocial: cliente.razonSocial,
            tipoIdentificacion: clienteCrearDto.tipoIdentificacion,
            numeroIdentificacion: cliente.numeroIdentificacion,
            telefono: cliente.telefono,
            mail: cliente.mail,
            direccion: cliente.direccion,
        };
    }

    async update(cliente: CreateClientDto, clientId: mongoose.Types.ObjectId, usuarioId: string): Promise<GetClientDto> {
        const tipoIdentificacion = await this.generalService.getTipoIdentificacionByCodigo(cliente.tipoIdentificacion);
        const clienteExistente = await this.clienteModel.findById(clientId).exec();
        if (!clienteExistente) {
            throw new Error('Cliente no encontrado');
        }
        if (clienteExistente.usuario.toString() !== usuarioId) {
            throw new Error('No tienes permiso para actualizar este cliente');
        }
        if (!tipoIdentificacion) {
            throw new Error('Tipo de identificación inválido');
        }
        clienteExistente.tipoIdentificacion = tipoIdentificacion._id as string;
        clienteExistente.razonSocial = cliente.razonSocial;
        clienteExistente.numeroIdentificacion = cliente.numeroIdentificacion;
        clienteExistente.telefono = cliente.telefono;
        clienteExistente.mail = cliente.mail;
        clienteExistente.direccion = cliente.direccion;
        const clienteUpdate = await this.clienteModel.findByIdAndUpdate(clientId, clienteExistente, { new: true }).exec();
        return {
            _id: clienteUpdate._id.toString(),
            activo: clienteUpdate.activo,
            razonSocial: clienteUpdate.razonSocial,
            tipoIdentificacion: cliente.tipoIdentificacion,
            numeroIdentificacion: clienteUpdate.numeroIdentificacion,
            telefono: clienteUpdate.telefono,
            mail: clienteUpdate.mail,
            direccion: clienteUpdate.direccion,
        };
    }

    async delete(clienteId: mongoose.Types.ObjectId, usuarioId: string): Promise<void> {
        const cliente = await this.clienteModel.findById(clienteId).exec();
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }
        if (cliente.usuario.toString() !== usuarioId) {
            throw new Error('No tienes permiso para eliminar este cliente');
        }
        await this.clienteModel.findByIdAndDelete(clienteId).exec();
    }
}
