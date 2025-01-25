import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FacturaEmitida } from './facturaEmitida.schema';

@Schema({
    autoIndex: true,
    toJSON: { virtuals: true }
})
export class DatoAdicionalFactura {
    @Prop({ type: mongoose.Types.ObjectId, ref: FacturaEmitida.name })
    facturaEmitida: string;
    @Prop()
    nombreAdicional: string;
    @Prop()
    valorAdicional: string;
    @Prop()
    emitidaRecibida: string;
}

export const DatoAdicionalFacturaSchema = SchemaFactory.createForClass(DatoAdicionalFactura);