import { Injectable } from '@nestjs/common';
import { Cliente } from './schemas/cliente.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { GeneralService } from 'src/general/general.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientDto } from './dto/get-client.dto';
import { IGenericResponse } from 'src/types/general';

@Injectable()
export class ClienteService {
    constructor(
        @InjectModel('Cliente')
        private clienteModel: mongoose.Model<Cliente>,
        private generalService: GeneralService,
    ) { }

    async findAll(usuarioId: mongoose.Types.ObjectId): Promise<GetClientDto[]> {
        const clientes = await this.clienteModel.find({ usuario: usuarioId }).exec();
        const clientesConTipoIdentificacion = await Promise.all(
            clientes.map(async (cliente) => {
                const tipoIdentificacion = await this.generalService.getTipoIdentificacionById(cliente.tipoIdentificacion.toString());
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
        const tipoIdentificacion = await this.generalService.getTipoIdentificacionById(cliente.tipoIdentificacion.toString());
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
        const tipoIdentificacion = await this.generalService.getTipoIdentificacionById(cliente.tipoIdentificacion.toString());
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

    async save(clienteCrearDto: CreateClientDto, usuarioId: string): Promise<IGenericResponse> {
        const cliente = new this.clienteModel(clienteCrearDto);
        cliente.usuario = new Types.ObjectId(usuarioId) as unknown as ObjectId;
        const tipoIdentificacionSave = await this.generalService.getTipoIdentificacionByCodigo(clienteCrearDto.tipoIdentificacion);
        cliente.tipoIdentificacion = new Types.ObjectId(tipoIdentificacionSave.id) as unknown as ObjectId;
        cliente.activo = true;
        await cliente.save();
        return { success: true };
    }

    async update(cliente: CreateClientDto, clientId: mongoose.Types.ObjectId, usuarioId: string): Promise<IGenericResponse> {
        const tipoIdentificacion = await this.generalService.getTipoIdentificacionByCodigo(cliente.tipoIdentificacion);
        const clienteExistente = await this.clienteModel.findById(clientId).exec();
        if (!clienteExistente) {
            return { success: false, message: 'Cliente no encontrado' };
        }
        if (clienteExistente.usuario.toString() !== usuarioId) {
            return { success: false, message: 'No tienes permiso para eliminar este cliente' };
        }
        if (!tipoIdentificacion) {
            return { success: false, message: 'Tipo de identificación inválido' };
        }
        clienteExistente.tipoIdentificacion = new Types.ObjectId(tipoIdentificacion.id) as unknown as ObjectId;
        clienteExistente.razonSocial = cliente.razonSocial;
        clienteExistente.numeroIdentificacion = cliente.numeroIdentificacion;
        clienteExistente.telefono = cliente.telefono;
        clienteExistente.mail = cliente.mail;
        clienteExistente.direccion = cliente.direccion;
        const clienteUpdate = await this.clienteModel.findByIdAndUpdate(clientId, clienteExistente, { new: true }).exec();
        return { success: true };
    }

    async delete(clienteId: mongoose.Types.ObjectId, usuarioId: string): Promise<IGenericResponse> {
        const cliente = await this.clienteModel.findById(clienteId).exec();
        if (!cliente) {
            return { success: false, message: 'Cliente no encontrado' };
        }
        if (cliente.usuario.toString() !== usuarioId) {
            return { success: false, message: 'No tienes permiso para eliminar este cliente' };
        }
        await this.clienteModel.findByIdAndDelete(clienteId).exec();
        return { success: true };
    }
}
