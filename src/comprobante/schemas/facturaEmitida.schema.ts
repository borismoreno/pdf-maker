import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Cliente } from 'src/cliente/schemas/cliente.schema';

@Schema()
export class FacturaEmitida {
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
    totalDescuento: string;
    @Prop()
    propina: string;
    @Prop()
    totalIva: string;
    @Prop()
    importeTotal: string;
    @Prop()
    moneda: string;
    @Prop()
    estadoComprobante: string;
    @Prop()
    usuario: string;
    @Prop({ type: mongoose.Types.ObjectId, ref: 'Cliente' })
    cliente: string;
}

export const FacturaEmitidaSchema = SchemaFactory.createForClass(FacturaEmitida);

