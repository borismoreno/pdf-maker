// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose from 'mongoose';

import { Schema, Document } from "mongoose";

// @Schema()
// export class TipoIdentificacion {
//     @Prop({ type: mongoose.Types.ObjectId })
//     _id: mongoose.Types.ObjectId;
//     @Prop()
//     codigo: string;
//     @Prop()
//     tipoIdentificacion: string;
//     @Prop()
//     activo: boolean;
// }

// export const TipoIdentificacionSchema = SchemaFactory.createForClass(TipoIdentificacion);

export interface TipoIdentificacion extends Document {
    id: string;
    codigo: string;
    tipoIdentificacion: string;
    activo: boolean;
}

export const TipoIdentificacionSchema = new Schema<TipoIdentificacion>({
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true,
    },
    tipoIdentificacion: {
        type: String,
        required: [true, 'El tipo de identificación es obligatorio'],
    },
    activo: {
        type: Boolean,
        default: true,
    }
})