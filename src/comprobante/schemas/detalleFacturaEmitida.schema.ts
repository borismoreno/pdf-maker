import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FacturaEmitida } from './facturaEmitida.schema';

@Schema()
export class DetalleFacturaEmitida {
    @Prop()
    _id: string;
    @Prop({ type: mongoose.Types.ObjectId, ref: FacturaEmitida.name })
    facturaEmitida: string;
    @Prop()
    codigoPrincipal: string;
    @Prop()
    descripcion: string;
    @Prop()
    cantidad: string;
    @Prop()
    precioUnitario: string;
    @Prop()
    descuento: string;
    @Prop()
    totalSinImpuesto: string;
    @Prop()
    valorImpuesto: string;
    @Prop()
    emitidaRecibida: string;
}

export const DetalleFacturaEmitidaSchema = SchemaFactory.createForClass(DetalleFacturaEmitida);