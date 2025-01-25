import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacturaEmitidaSchema } from './schemas/facturaEmitida.schema';
import { ComprobanteService } from './comprobante.service';
import { DetalleFacturaEmitidaSchema } from './schemas/detalleFacturaEmitida.schema';
import { FormaPagoFacturaSchema } from './schemas/formaPagoFactura.schema';
import { DatoAdicionalFacturaSchema } from './schemas/datoAdicionalFactura.schema';
import { ImpuestoComprobanteSchema } from './schemas/impuestoComprobante.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'FacturaEmitida', schema: FacturaEmitidaSchema },
            { name: 'DetalleFacturaEmitida', schema: DetalleFacturaEmitidaSchema },
            { name: 'FormaPagoFactura', schema: FormaPagoFacturaSchema },
            { name: 'DatoAdicionalFactura', schema: DatoAdicionalFacturaSchema },
            { name: 'ImpuestoComprobante', schema: ImpuestoComprobanteSchema }
        ])
    ],
    providers: [ComprobanteService],
    exports: [ComprobanteService]
})
export class ComprobanteModule { }