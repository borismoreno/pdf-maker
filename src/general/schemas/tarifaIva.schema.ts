import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class TarifaIva {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
    @Prop()
    codigo: string;
    @Prop()
    porcentaje: string;
    @Prop()
    activo: boolean;
}

export const TarifaIvaSchema = SchemaFactory.createForClass(TarifaIva);