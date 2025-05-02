import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoIdentificacionSchema } from './schemas/tipoIdentificacion.schema';
import { GeneralService } from './general.service';
import { TipoProductoSchema } from './schemas/tipoProducto.schema';
import { TarifaIvaSchema } from './schemas/tarifaIva.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'TipoIdentificacion', schema: TipoIdentificacionSchema },
            { name: 'TipoProducto', schema: TipoProductoSchema },
            { name: 'TarifaIva', schema: TarifaIvaSchema }
        ])
    ],
    providers: [GeneralService],
    exports: [GeneralService]
})
export class GeneralModule { }
