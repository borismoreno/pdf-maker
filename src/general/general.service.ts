import { Injectable } from '@nestjs/common';
import { TipoIdentificacion } from './schemas/tipoIdentificacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class GeneralService {
    constructor(
        @InjectModel(TipoIdentificacion.name)
        private tipoIdentificacionModel: mongoose.Model<TipoIdentificacion>,
    ) { }

    async getTipoIdentificacionById(id: mongoose.Types.ObjectId): Promise<TipoIdentificacion> {
        const tipoIdentificacion = await this.tipoIdentificacionModel.findById(id).exec();
        return tipoIdentificacion;
    }

    async getTipoIdentificacionByCodigo(codigo: string): Promise<TipoIdentificacion> {
        const tipoIdentificacion = await this.tipoIdentificacionModel.findOne({ codigo }).exec();
        return tipoIdentificacion;
    }
}
