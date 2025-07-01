import { Document, Schema } from 'mongoose';

export interface Empresa extends Document {
    id: string;
    obligadoContabilidad?: boolean;
    secuencialNotaCredito?: number;
    secuencialRetencion?: number;
    regimenMicroempresa?: boolean;
    ambiente?: number;
    tipoEmision?: number;
    razonSocial?: string;
    nombreComercial?: string;
    ruc?: string;
    establecimiento?: string;
    puntoEmision?: string;
    direccionMatriz?: string;
    direccionEstablecimiento?: string;
    contribuyenteEspecial?: string;
    secuencialFactura?: number;
    claveFirma?: string;
    pathCertificado?: string;
    pathLogo?: string;
    nombreNotificacion?: string;
    contribuyenteRimpe?: boolean;
    activo?: boolean;
}

export const EmpresaSchema = new Schema<Empresa>({
    obligadoContabilidad: {
        type: Boolean,
        default: false
    },
    secuencialNotaCredito: {
        type: Number,
        default: 1
    },
    secuencialRetencion: {
        type: Number,
        default: 1
    },
    regimenMicroempresa: {
        type: Boolean,
        default: false
    },
    ambiente: {
        type: Number,
        default: 1
    },
    tipoEmision: {
        type: Number,
        default: 1
    },
    razonSocial: {
        type: String,
        required: false
    },
    nombreComercial: {
        type: String,
        required: false
    },
    ruc: {
        type: String,
        required: false
    },
    establecimiento: {
        type: String,
        default: '001'
    },
    puntoEmision: {
        type: String,
        default: '001'
    },
    direccionMatriz: {
        type: String,
        required: false
    },
    direccionEstablecimiento: {
        type: String,
        required: false
    },
    contribuyenteEspecial: {
        type: String,
        required: false
    },
    secuencialFactura: {
        type: Number,
        default: 1
    },
    claveFirma: {
        type: String,
        required: false
    },
    pathCertificado: {
        type: String,
        required: false
    },
    pathLogo: {
        type: String,
        required: false
    },
    nombreNotificacion: {
        type: String,
        required: false
    },
    contribuyenteRimpe: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    }
});