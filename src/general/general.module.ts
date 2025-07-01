import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoIdentificacionSchema } from './schemas/tipoIdentificacion.schema';
import { GeneralService } from './general.service';
import { TipoProductoSchema } from './schemas/tipoProducto.schema';
import { TarifaIvaSchema } from './schemas/tarifaIva.schema';
import { GeneralController } from './general.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'TipoIdentificacion', schema: TipoIdentificacionSchema },
            { name: 'TipoProducto', schema: TipoProductoSchema },
            { name: 'TarifaIva', schema: TarifaIvaSchema }
        ])
    ],
    providers: [GeneralService],
    exports: [GeneralService],
    controllers: [GeneralController]
})
export class GeneralModule { }
