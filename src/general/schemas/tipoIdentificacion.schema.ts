import { Schema, Document } from "mongoose";

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