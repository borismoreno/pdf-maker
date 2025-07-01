import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TarifaIva } from 'src/general/schemas/tarifaIva.schema';
import { TipoProducto } from 'src/general/schemas/tipoProducto.schema';
import { Usuario } from 'src/user/schemas/user.schema';

@Schema()
export class Producto {
    @Prop()
    codigoPrincipal: string;
    @Prop()
    codigoAuxiliar: string;
    @Prop()
    activo: boolean;
    @Prop({ type: mongoose.Types.ObjectId, ref: TipoProducto.name })
    tipoProducto: mongoose.Types.ObjectId;
    @Prop({ type: mongoose.Types.ObjectId, ref: TarifaIva.name })
    tarifaIva: mongoose.Types.ObjectId;
    @Prop()
    descripcion: string;
    @Prop()
    valorUnitario: number;
    @Prop({ type: mongoose.Types.ObjectId, ref: 'Usuario' })
    usuario: mongoose.Types.ObjectId;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);