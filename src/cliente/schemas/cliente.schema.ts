import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TipoIdentificacion } from 'src/general/schemas/tipoIdentificacion.schema';
import { Usuario } from 'src/user/schemas/user.schema';

@Schema()
export class Cliente {
    @Prop()
    razonSocial: string;
    @Prop()
    activo: boolean;
    @Prop({ type: mongoose.Types.ObjectId, ref: TipoIdentificacion.name })
    tipoIdentificacion: mongoose.Types.ObjectId;
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