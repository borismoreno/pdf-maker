import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from './schemas/producto.schema';
import mongoose, { Schema, Types, ObjectId } from 'mongoose';
import { GeneralService } from 'src/general/general.service';
import { GetProductoDto } from './dto/get-producto.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { IGenericResponse } from 'src/types/general';

@Injectable()
export class ProductoService {
    constructor(
        @InjectModel('Producto')
        private readonly productoModel: mongoose.Model<Producto>,
        private readonly generalService: GeneralService,
    ) { }

    async findAll(usuarioId: string): Promise<GetProductoDto[]> {
        const productos = await this.productoModel.find({ usuario: usuarioId }).exec();
        const productosConTipoProducto = await Promise.all(
            productos.map(async (producto) => {
                const tipoProducto = await this.generalService.getTipoProductoById(producto.tipoProducto.toString());
                const tarifaIva = await this.generalService.getTarifaIvaById(producto.tarifaIva.toString());
                const productoDto: GetProductoDto = {
                    id: producto.id,
                    codigoPrincipal: producto.codigoPrincipal,
                    codigoAuxiliar: producto.codigoAuxiliar,
                    tipoProducto: tipoProducto ? tipoProducto.codigo : '',
                    tipoProductoDescripcion: tipoProducto ? tipoProducto.descripcion : '',
                    tarifaIvaDescripcion: tarifaIva ? tarifaIva.porcentaje : '',
                    tarifaIva: tarifaIva ? tarifaIva.codigo : '',
                    descripcion: producto.descripcion,
                    valorUnitario: producto.valorUnitario,
                }
                return productoDto;
            })
        );
        return productosConTipoProducto;
    }

    async save(productoCrearDto: CreateProductoDto, usuarioId: string): Promise<IGenericResponse> {
        try {
            const producto = new this.productoModel(productoCrearDto);
            producto.usuario = new Types.ObjectId(usuarioId) as unknown as ObjectId;
            const tipoProductoSave = await this.generalService.getTipoProductoByCodigo(productoCrearDto.tipoProducto);
            const tarifaIvaSave = await this.generalService.getTarifaIvaByCodigo(productoCrearDto.tarifaIva);
            producto.tipoProducto = new Types.ObjectId(tipoProductoSave.id) as unknown as ObjectId;
            producto.tarifaIva = new Types.ObjectId(tarifaIvaSave.id) as unknown as ObjectId;
            producto.activo = true;

            // Autogenerar codigo principal si no se proporciona con el prefijo 'P' seguido por un secuencial manteniendo el formato de 6 dígitos
            if (!producto.codigoPrincipal) {
                let secuencial = await this.productoModel.countDocuments({ usuario: usuarioId }).exec();
                //validar recursivamente que el código principal no exista caso contratio generar otro y validar nuevamente hasta que no exista
                producto.codigoPrincipal = `PROD${String(secuencial + 1).padStart(4, '0')}`;
                while (await this.productoModel.findOne({ codigoPrincipal: producto.codigoPrincipal, usuario: usuarioId }).exec()) {
                    secuencial++;
                    // Generar un nuevo código principal
                    // y validar nuevamente hasta que no exista
                    producto.codigoPrincipal = `PROD${String(secuencial + 1).padStart(4, '0')}`;
                }
            } else {
                // Validar que el código principal no exista
                const existingProducto = await this.productoModel.findOne({
                    codigoPrincipal: producto.codigoPrincipal,
                    usuario: usuarioId
                }).exec();
                if (existingProducto) {
                    return { success: false, message: 'El código principal ya existe.' };
                }
            }


            // // validar que todos los campos requeridos estén presentes
            // if (!producto.codigoPrincipal || !producto.descripcion || !producto.valorUnitario || !tipoProductoSave || !tarifaIvaSave) {
            //     return { success: false, message: 'Todos los campos requeridos deben estar presentes.' };
            // }
            await producto.save();
            return {
                success: true, data: {
                    id: producto.id,
                    codigoPrincipal: producto.codigoPrincipal,
                    codigoAuxiliar: producto.codigoAuxiliar,
                    tipoProducto: tipoProductoSave ? tipoProductoSave.codigo : '',
                    tipoProductoDescripcion: tipoProductoSave ? tipoProductoSave.descripcion : '',
                    tarifaIvaDescripcion: tarifaIvaSave ? tarifaIvaSave.porcentaje : '',
                    tarifaIva: tarifaIvaSave ? tarifaIvaSave.codigo : '',
                    descripcion: producto.descripcion,
                    valorUnitario: producto.valorUnitario
                }
            };
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((err: any) => err.message);
                return { success: false, message: errors.join(', ') };
            }
            return { success: false, message: 'Error al guardar el producto.' };
        }
    }

    async update(productoActualizarDto: CreateProductoDto, id: string, usuarioId: string): Promise<IGenericResponse> {
        const producto = await this.productoModel.findById(id).exec();
        if (!producto) {
            return { success: false, message: 'Producto no encontrado.' }
        }
        if (producto.usuario.toString() !== usuarioId) {
            return { success: false, message: 'No tienes permiso para eliminar este producto.' }
        }
        const tipoProductoSave = await this.generalService.getTipoProductoByCodigo(productoActualizarDto.tipoProducto);
        const tarifaIvaSave = await this.generalService.getTarifaIvaByCodigo(productoActualizarDto.tarifaIva);
        producto.codigoPrincipal = productoActualizarDto.codigoPrincipal;
        producto.codigoAuxiliar = productoActualizarDto.codigoAuxiliar;
        producto.descripcion = productoActualizarDto.descripcion;
        producto.valorUnitario = productoActualizarDto.valorUnitario;
        producto.tipoProducto = new Types.ObjectId(tipoProductoSave.id) as unknown as ObjectId;
        producto.tarifaIva = new Types.ObjectId(tarifaIvaSave.id) as unknown as ObjectId;
        await producto.save();
        return { success: true };
    }

    async delete(productoId: string, usuarioId: string): Promise<IGenericResponse> {
        const producto = await this.productoModel.findById(productoId).exec();
        if (!producto) {
            return { success: false, message: 'Producto no encontrado.' }
        }
        if (producto.usuario.toString() !== usuarioId) {
            return { success: false, message: 'No tienes permiso para eliminar este producto.' }
        }
        await this.productoModel.findByIdAndDelete(productoId).exec();
        return { success: true }
    }
}
