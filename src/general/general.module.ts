import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoIdentificacionSchema } from './schemas/tipoIdentificacion.schema';
import { GeneralService } from './general.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'TipoIdentificacion', schema: TipoIdentificacionSchema }
        ])
    ],
    providers: [GeneralService],
    exports: [GeneralService]
})
export class GeneralModule { }
