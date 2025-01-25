import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FacturaEmitida } from './facturaEmitida.schema';

@Schema({
    autoIndex: true,
    toJSON: { virtuals: true }
})
export class FormaPagoFactura {
    @Prop({ type: mongoose.Types.ObjectId, ref: FacturaEmitida.name })
    facturaEmitida: string;
    @Prop()
    formaPago: string;
    @Prop()
    total: string;
    @Prop()
    plazo: string;
    @Prop()
    unidadTiempo: string;
    @Prop()
    emitidaRecibida: string;
}

export const FormaPagoFacturaSchema = SchemaFactory.createForClass(FormaPagoFactura);