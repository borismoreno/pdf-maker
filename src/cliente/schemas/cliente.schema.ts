import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Cliente {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
    @Prop()
    razonSocial: string;
    @Prop()
    activo: boolean;
    @Prop()
    tipoIdentificacion: string;
    @Prop()
    numeroIdentificacion: string;
    @Prop()
    telefono: string;
    @Prop()
    mail: string;
    @Prop()
    direccion: string;
    @Prop()
    usuario: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);