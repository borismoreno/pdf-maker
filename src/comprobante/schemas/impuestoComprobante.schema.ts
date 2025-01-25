import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ImpuestoComprobante {
    @Prop()
    impuestoPadre: string;
    @Prop()
    codigoImpuesto: string;
    @Prop()
    codigoPorcentaje: string;
    @Prop()
    baseImponible: string;
    @Prop()
    valor: string;
    @Prop()
    tarifa: string;
    @Prop()
    tipoImpuesto: string;
    @Prop()
    emitidaRecibida: string;
}

export const ImpuestoComprobanteSchema = SchemaFactory.createForClass(ImpuestoComprobante);