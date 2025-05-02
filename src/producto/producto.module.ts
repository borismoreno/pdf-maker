import { Module } from '@nestjs/common';
import { GeneralModule } from 'src/general/general.module';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductoSchema } from './schemas/producto.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Producto', schema: ProductoSchema }]),
        GeneralModule
    ],
    controllers: [ProductoController],
    providers: [ProductoService],
    exports: [ProductoService]
})
export class ProductoModule { }
