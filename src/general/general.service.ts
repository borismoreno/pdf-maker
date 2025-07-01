import { Injectable } from '@nestjs/common';
import { TipoIdentificacion } from './schemas/tipoIdentificacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TipoProducto } from './schemas/tipoProducto.schema';
import { TarifaIva } from './schemas/tarifaIva.schema';
import { IGetTipoIdentificacionResponse } from './dto/get-tipo-identificacion.dto';

@Injectable()
export class GeneralService {
    constructor(
        @InjectModel('TipoIdentificacion')
        private tipoIdentificacionModel: mongoose.Model<TipoIdentificacion>,
        @InjectModel(TipoProducto.name)
        private tipoProductoModel: mongoose.Model<TipoProducto>,
        @InjectModel(TarifaIva.name)
        private tarifaIvaModel: mongoose.Model<TarifaIva>,
    ) { }

    async getAllTipoIdentificacion(): Promise<IGetTipoIdentificacionResponse[]> {
        const tipoIdentificaciones = await this.tipoIdentificacionModel.find({ activo: true }).exec();
        return tipoIdentificaciones.map(tipo => ({
            codigo: tipo.codigo,
            tipoIdentificacion: tipo.tipoIdentificacion,
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

    async getTipoProductoById(id: mongoose.Types.ObjectId): Promise<TipoProducto> {
        const tipoProducto = await this.tipoProductoModel.findById(id).exec();
        return tipoProducto;
    }

    async getTipoProductoByCodigo(codigo: string): Promise<TipoProducto> {
        const tipoProducto = await this.tipoProductoModel.findOne({ codigo }).exec();
        return tipoProducto;
    }

    async getTarifaIvaById(id: mongoose.Types.ObjectId): Promise<TarifaIva> {
        const tarifaIva = await this.tarifaIvaModel.findById(id).exec();
        return tarifaIva;
    }

    async getTarifaIvaByCodigo(codigo: string): Promise<TarifaIva> {
        const tarifaIva = await this.tarifaIvaModel.findOne({ codigo }).exec();
        return tarifaIva;
    }
}
