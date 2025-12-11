import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacturaEmitidaSchema } from './schemas/facturaEmitida.schema';
import { ComprobanteService } from './comprobante.service';
import { DetalleFacturaEmitidaSchema } from './schemas/detalleFacturaEmitida.schema';
import { FormaPagoFacturaSchema } from './schemas/formaPagoFactura.schema';
import { DatoAdicionalFacturaSchema } from './schemas/datoAdicionalFactura.schema';
import { ImpuestoComprobanteSchema } from './schemas/impuestoComprobante.schema';
import { ComprobanteController } from './comprobante.controller';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { UserModule } from 'src/user/user.module';
import { ClienteModule } from 'src/cliente/cliente.module';
import { SocketsModule } from 'src/sockets/sockets.module';
import { NotaCreditoEmitidaSchema } from './schemas/notaCreditoEmitida.schema';
import { DetalleNotaCreditoEmitidaSchema } from './schemas/detalleNotaCreditoEmitida.schema';
import { DatoAdicionalNotaCreditoSchema } from './schemas/datoAdicionalNotaCredito.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'FacturaEmitida', schema: FacturaEmitidaSchema },
            { name: 'NotaCreditoEmitida', schema: NotaCreditoEmitidaSchema },
            { name: 'DetalleFacturaEmitida', schema: DetalleFacturaEmitidaSchema },
            { name: 'DetalleNotaCreditoEmitida', schema: DetalleNotaCreditoEmitidaSchema },
            { name: 'FormaPagoFactura', schema: FormaPagoFacturaSchema },
            { name: 'DatoAdicionalFactura', schema: DatoAdicionalFacturaSchema },
            { name: 'DatoAdicionalNotaCredito', schema: DatoAdicionalNotaCreditoSchema },
            { name: 'ImpuestoComprobante', schema: ImpuestoComprobanteSchema }
        ]),
        EmpresaModule,
        UserModule,
        ClienteModule,
        SocketsModule
    ],
    providers: [ComprobanteService],
    exports: [ComprobanteService],
    controllers: [ComprobanteController]
})
export class ComprobanteModule { }