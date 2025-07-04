import { Document, Schema } from "mongoose";

export interface Cliente extends Document {
    id: string;
    razonSocial: string;
    activo: boolean;
    tipoIdentificacion: Schema.Types.ObjectId;
    numeroIdentificacion: string;
    telefono: string;
    mail: string;
    direccion: string;
    usuario: Schema.Types.ObjectId;
}

export const ClienteSchema = new Schema<Cliente>({
    razonSocial: {
        type: String,
        required: [true, 'La Razón Social es obligatoria.']
    },
    activo: {
        type: Boolean,
        default: true
    },
    tipoIdentificacion: {
        type: Schema.Types.ObjectId,
        ref: 'TipoIdentificacion',
        required: [true, 'El tipo de identificación es obligatorio']
    },
    numeroIdentificacion: {
        type: String,
        required: [true, 'El número de identificación es obligatorio.']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio.']
    },
    mail: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio.']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria.']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    }
})