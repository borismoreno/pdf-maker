import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class NotaCreditoEmitida {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
    @Prop()
    contribuyenteEspecial: string;
    @Prop()
    contribuyenteRimpe: boolean;
    @Prop()
    ambiente: string;
    @Prop()
    tipoEmision: string;
    @Prop()
    razonSocial: string;
    @Prop()
    nombreComercial: string;
    @Prop()
    ruc: string;
    @Prop()
    claveAcceso: string;
    @Prop()
    codDoc: string;
    @Prop()
    estab: string;
    @Prop()
    ptoEmi: string;
    @Prop()
    secuencial: string;
    @Prop()
    dirMatriz: string;
    @Prop()
    fechaEmision: string;
    @Prop()
    dirEstablecimiento: string;
    @Prop()
    obligadoContabilidad: string;
    @Prop()
    tipoIdentificacionComprador: string;
    @Prop()
    razonSocialComprador: string;
    @Prop()
    identificacionComprador: string;
    @Prop()
    totalSinImpuestos: string;
    @Prop()
    codDocModificado: string;
    @Prop()
    numDocModificado: string;
    @Prop()
    fechaEmisionDocSustento: string;
    @Prop()
    valorModificacion: string;
    @Prop()
    totalDescuento: string;
    @Prop()
    motivo: string;
    @Prop()
    totalIva: string;
    @Prop()
    moneda: string;
    @Prop()
    estadoComprobante: string;
    @Prop()
    usuario: string;
    @Prop({ type: mongoose.Types.ObjectId, ref: 'FacturaEmitida' })
    facturaEmitida: string;
}

export const NotaCreditoEmitidaSchema = SchemaFactory.createForClass(NotaCreditoEmitida);