import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoIdentificacionSchema } from './schemas/tipoIdentificacion.schema';
import { GeneralService } from './general.service';
import { TipoProductoSchema } from './schemas/tipoProducto.schema';
import { TarifaIvaSchema } from './schemas/tarifaIva.schema';
import { GeneralController } from './general.controller';
import { TipoFormaPagoSchema } from './schemas/tipoFormaPago.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'TipoIdentificacion', schema: TipoIdentificacionSchema },
            { name: 'TipoProducto', schema: TipoProductoSchema },
            { name: 'TarifaIva', schema: TarifaIvaSchema },
            { name: 'TipoFormaPago', schema: TipoFormaPagoSchema }
        ])
    ],
    providers: [GeneralService],
    exports: [GeneralService],
    controllers: [GeneralController]
})
export class GeneralModule { }
