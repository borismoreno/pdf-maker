import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class TipoProducto {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
    @Prop()
    codigo: string;
    @Prop()
    descripcion: string;
    @Prop()
    activo: boolean;
}

export const TipoProductoSchema = SchemaFactory.createForClass(TipoProducto);