import { Schema } from "mongoose";

export interface TarifaIva {
    id: string;
    codigo: string;
    porcentaje: string;
    activo: boolean;
}

export const TarifaIvaSchema = new Schema<TarifaIva>({
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true,
    },
    porcentaje: {
        type: String,
        required: [true, 'El porcentaje es obligatorio'],
    },
    activo: {
        type: Boolean,
        default: true,
    }
})