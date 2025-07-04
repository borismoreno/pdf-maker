import { Document, Schema } from "mongoose";

export interface Producto extends Document {
    id: string;
    codigoPrincipal: string;
    codigoAuxiliar: string;
    activo: boolean;
    tipoProducto: Schema.Types.ObjectId;
    tarifaIva: Schema.Types.ObjectId;
    descripcion: string;
    valorUnitario: number;
    usuario: Schema.Types.ObjectId;
}

export const ProductoSchema = new Schema<Producto>({
    codigoPrincipal: {
        type: String,
        required: [true, 'El código principal es obligatorio']
    },
    codigoAuxiliar: {
        type: String,
        required: false
    },
    activo: {
        type: Boolean,
        default: true
    },
    tipoProducto: {
        type: Schema.Types.ObjectId,
        ref: 'TipoProducto',
        required: [true, 'El tipo de producto es obligatorio']
    },
    tarifaIva: {
        type: Schema.Types.ObjectId,
        ref: 'TarifaIva',
        required: [true, 'La tarifa IVA es obligatoria']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    valorUnitario: {
        type: Number,
        required: [true, 'El valor unitario es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    }
})