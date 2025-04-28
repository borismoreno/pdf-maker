import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Usuario } from 'src/user/schemas/user.schema';

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
    @Prop({ type: mongoose.Types.ObjectId, ref: Usuario.name })
    usuario: mongoose.Types.ObjectId;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);