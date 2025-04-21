import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Empresa {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
    @Prop()
    obligadoContabilidad: string;
    @Prop()
    secuencialNotaCredito: string;
    @Prop()
    secuencialRetencion: string;
    @Prop()
    ssl: boolean;
    @Prop()
    activo: boolean;
    @Prop()
    ambiente: number;
    @Prop()
    tipoEmision: number;
    @Prop()
    razonSocial: string;
    @Prop()
    nombreComercial: string;
    @Prop()
    establecimiento: string;
    @Prop()
    puntoEmision: string;
    @Prop()
    direccionMatriz: string;
    @Prop()
    direccionEstablecimiento: string;
    @Prop()
    contribuyenteEspecial: string;
    @Prop()
    secuencialFactura: string;
    @Prop()
    claveFirma: string;
    @Prop()
    mailEnvioComprobantes: string;
    @Prop()
    claveMail: string;
    @Prop()
    nombreNotificacion: string;
    @Prop()
    servidor: string;
    @Prop()
    puerto: number;
    @Prop()
    ruc: string;
    @Prop()
    pathCertificado: string;
    @Prop()
    contribuyenteRimpe: boolean;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);