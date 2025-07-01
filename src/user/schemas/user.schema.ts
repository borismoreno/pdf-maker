import { Document, Schema } from "mongoose";

export interface Usuario extends Document {
    id: string;
    rol?: string;
    activo: boolean;
    nombre: string;
    email: string;
    telefono: string;
    password: string;
    empresa: Schema.Types.ObjectId;
}

export const UserSchema = new Schema<Usuario>({
    rol: {
        type: String,
        required: false,
        default: 'ADMIN'
    },
    activo: {
        type: Boolean,
        default: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Por favor ingrese un email válido']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        // match: [/^\+?[1-9]\d{1,14}$/, 'Por favor ingrese un número de teléfono válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
})
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose from 'mongoose';

// @Schema()
// export class Usuario {
//     @Prop({ type: mongoose.Types.ObjectId })
//     _id: mongoose.Types.ObjectId;
//     @Prop()
//     rol: string;
//     @Prop()
//     estado: boolean;
//     @Prop()
//     nombre: string;
//     @Prop()
//     email: string;
//     @Prop()
//     password?: string;
//     @Prop()
//     empresa: string;
//     @Prop()
//     pagoRegistrado: boolean;
// }

// export const UserSchema = SchemaFactory.createForClass(Usuario);