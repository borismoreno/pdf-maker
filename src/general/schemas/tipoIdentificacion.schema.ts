import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class TipoIdentificacion {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
    @Prop()
    codigo: string;
    @Prop()
    tipoIdentificacion: string;
    @Prop()
    activo: boolean;
}

export const TipoIdentificacionSchema = SchemaFactory.createForClass(TipoIdentificacion);