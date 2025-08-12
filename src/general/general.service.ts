import { Injectable } from '@nestjs/common';
import { TipoIdentificacion } from './schemas/tipoIdentificacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TipoProducto } from './schemas/tipoProducto.schema';
import { TarifaIva } from './schemas/tarifaIva.schema';
import { IGetTarifaIvaResponse, IGetTipoFormaPagoResponse, IGetTipoIdentificacionResponse, IGetTipoProductoResponse } from './dto/get-tipo-identificacion.dto';
import { TipoFormaPago } from './schemas/tipoFormaPago.schema';

@Injectable()
export class GeneralService {
    constructor(
        @InjectModel('TipoIdentificacion')
        private tipoIdentificacionModel: mongoose.Model<TipoIdentificacion>,
        @InjectModel('TipoProducto')
        private tipoProductoModel: mongoose.Model<TipoProducto>,
        @InjectModel('TarifaIva')
        private tarifaIvaModel: mongoose.Model<TarifaIva>,
        @InjectModel('TipoFormaPago')
        private tipoFormaPagoModel: mongoose.Model<TipoFormaPago>,
    ) { }

    async getAllTipoIdentificacion(): Promise<IGetTipoIdentificacionResponse[]> {
        const tipoIdentificaciones = await this.tipoIdentificacionModel.find({ activo: true }).exec();
        return tipoIdentificaciones.map(tipo => ({
            codigo: tipo.codigo,
            tipoIdentificacion: tipo.tipoIdentificacion,
        }));
    }

    async getAllTipoProducto(): Promise<IGetTipoProductoResponse[]> {
        const tipoProductos = await this.tipoProductoModel.find({ activo: true }).exec();
        return tipoProductos.map(tipo => ({
            codigo: tipo.codigo,
            descripcion: tipo.descripcion,
        }));
    }

    async getAllTarifaIva(): Promise<IGetTarifaIvaResponse[]> {
        const tarifasIva = await this.tarifaIvaModel.find({ activo: true }).exec();
        return tarifasIva.map(tipo => ({
            codigo: tipo.codigo,
            porcentaje: tipo.porcentaje,
        }));
    }

    async getAllTipoFormaPago(): Promise<IGetTipoFormaPagoResponse[]> {
        const tiposFormaPago = await this.tipoFormaPagoModel.find({ activo: true }).exec();
        return tiposFormaPago.map(tipo => ({
            codigo: tipo.codigo,
            formaPago: tipo.formaPago,
        }));
    }

    async getTipoIdentificacionById(id: string): Promise<TipoIdentificacion> {
        const tipoIdentificacion = await this.tipoIdentificacionModel.findById(id).exec();
        return tipoIdentificacion;
    }

    async getTipoIdentificacionByCodigo(codigo: string): Promise<TipoIdentificacion> {
        const tipoIdentificacion = await this.tipoIdentificacionModel.findOne({ codigo }).exec();
        return tipoIdentificacion;
    }

    async getTipoProductoById(id: string): Promise<TipoProducto> {
        const tipoProducto = await this.tipoProductoModel.findById(id).exec();
        return tipoProducto;
    }

    async getTipoProductoByCodigo(codigo: string): Promise<TipoProducto> {
        const tipoProducto = await this.tipoProductoModel.findOne({ codigo }).exec();
        return tipoProducto;
    }

    async getTarifaIvaById(id: string): Promise<TarifaIva> {
        const tarifaIva = await this.tarifaIvaModel.findById(id).exec();
        return tarifaIva;
    }

    async getTarifaIvaByCodigo(codigo: string): Promise<TarifaIva> {
        const tarifaIva = await this.tarifaIvaModel.findOne({ codigo }).exec();
        return tarifaIva;
    }
}
