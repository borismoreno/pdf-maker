import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotaCreditoEmitida } from './notaCreditoEmitida.schema';

@Schema({
    autoIndex: true,
    toJSON: { virtuals: true }
})
export class DatoAdicionalNotaCredito {
    @Prop({ type: mongoose.Types.ObjectId, ref: NotaCreditoEmitida.name })
    notaCreditoEmitida: string;
    @Prop()
    nombreAdicional: string;
    @Prop()
    valorAdicional: string;
    @Prop()
    emitidaRecibida: string;
}

export const DatoAdicionalNotaCreditoSchema = SchemaFactory.createForClass(DatoAdicionalNotaCredito);