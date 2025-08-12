import { Schema } from "mongoose";

export interface TipoFormaPago {
    id: string;
    codigo: string;
    formaPago: string;
    activo: boolean;
}

export const TipoFormaPagoSchema = new Schema<TipoFormaPago>({
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true,
    },
    formaPago: {
        type: String,
        required: [true, 'La forma de pago es obligatoria'],
    },
    activo: {
        type: Boolean,
        default: true,
    }
})