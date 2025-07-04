import { Document, Schema } from "mongoose";

export interface TipoProducto extends Document {
    id: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
}

export const TipoProductoSchema = new Schema<TipoProducto>({
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true,
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
    },
    activo: {
        type: Boolean,
        default: true,
    }
});