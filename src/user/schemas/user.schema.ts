import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Usuario {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
    @Prop()
    rol: string;
    @Prop()
    estado: boolean;
    @Prop()
    nombre: string;
    @Prop()
    email: string;
    @Prop()
    password?: string;
    @Prop()
    empresa: string;
    @Prop()
    pagoRegistrado: boolean;
}

export const UserSchema = SchemaFactory.createForClass(Usuario);