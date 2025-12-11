import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotaCreditoEmitida } from './notaCreditoEmitida.schema';

@Schema()
export class DetalleNotaCreditoEmitida {
    @Prop()
    _id: string;
    @Prop({ type: mongoose.Types.ObjectId, ref: NotaCreditoEmitida.name })
    notaCreditoEmitida: string;
    @Prop()
    descripcion: string;
    @Prop()
    cantidad: string;
    @Prop()
    precioUnitario: string;
    @Prop()
    descuento: string;
    @Prop()
    precioTotalSinImpuesto: string;
    @Prop()
    valorImpuesto: string;
    @Prop()
    emitidaRecibida: string;
}

export const DetalleNotaCreditoEmitidaSchema = SchemaFactory.createForClass(DetalleNotaCreditoEmitida);