import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from './schemas/producto.schema';
import mongoose from 'mongoose';
import { GeneralService } from 'src/general/general.service';
import { GetProductoDto } from './dto/get-producto.dto';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductoService {
    constructor(
        @InjectModel(Producto.name)
        private readonly productoModel: mongoose.Model<Producto>,
        private readonly generalService: GeneralService,
    ) { }

    async findAll(usuarioId: mongoose.Types.ObjectId): Promise<GetProductoDto[]> {
        const productos = await this.productoModel.find({ usuario: usuarioId }).exec();
        const productosConTipoProducto = await Promise.all(
            productos.map(async (producto) => {
                const tipoProducto = await this.generalService.getTipoProductoById(producto.tipoProducto);
                const tarifaIva = await this.generalService.getTarifaIvaById(producto.tarifaIva);
                const productoDto: GetProductoDto = {
                    _id: producto._id.toString(),
                    activo: producto.activo,
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

    async save(productoCrearDto: CreateProductoDto, usuarioId: string): Promise<GetProductoDto> {
        const producto = new this.productoModel(productoCrearDto);
        producto.usuario = new mongoose.Types.ObjectId(usuarioId);
        const tipoProductoSave = await this.generalService.getTipoProductoByCodigo(productoCrearDto.tipoProducto);
        const tarifaIvaSave = await this.generalService.getTarifaIvaByCodigo(productoCrearDto.tarifaIva);
        producto.tipoProducto = tipoProductoSave._id;
        producto.tarifaIva = tarifaIvaSave._id;
        producto.activo = true;
        await producto.save();
        return {
            _id: producto._id.toString(),
            activo: producto.activo,
            codigoPrincipal: producto.codigoPrincipal,
            codigoAuxiliar: producto.codigoAuxiliar,
            tipoProducto: tipoProductoSave.codigo,
            tipoProductoDescripcion: tipoProductoSave.descripcion,
            tarifaIvaDescripcion: tarifaIvaSave.porcentaje,
            tarifaIva: tarifaIvaSave.codigo,
            descripcion: producto.descripcion,
            valorUnitario: producto.valorUnitario,
        };
    }

    async update(productoActualizarDto: CreateProductoDto, id: mongoose.Types.ObjectId, usuarioId: string): Promise<GetProductoDto> {
        const producto = await this.productoModel.findById(id).exec();
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        if (producto.usuario.toString() !== usuarioId) {
            throw new Error('No tienes permiso para actualizar este producto');
        }
        const tipoProductoSave = await this.generalService.getTipoProductoByCodigo(productoActualizarDto.tipoProducto);
        const tarifaIvaSave = await this.generalService.getTarifaIvaByCodigo(productoActualizarDto.tarifaIva);
        producto.codigoPrincipal = productoActualizarDto.codigoPrincipal;
        producto.codigoAuxiliar = productoActualizarDto.codigoAuxiliar;
        producto.descripcion = productoActualizarDto.descripcion;
        producto.valorUnitario = productoActualizarDto.valorUnitario;
        producto.tipoProducto = tipoProductoSave._id;
        producto.tarifaIva = tarifaIvaSave._id;
        await producto.save();
        return {
            _id: producto._id.toString(),
            activo: producto.activo,
            codigoPrincipal: producto.codigoPrincipal,
            codigoAuxiliar: producto.codigoAuxiliar,
            tipoProducto: tipoProductoSave.codigo,
            tipoProductoDescripcion: tipoProductoSave.descripcion,
            tarifaIvaDescripcion: tarifaIvaSave.porcentaje,
            tarifaIva: tarifaIvaSave.codigo,
            descripcion: producto.descripcion,
            valorUnitario: producto.valorUnitario,
        };
    }

    async delete(productoId: mongoose.Types.ObjectId, usuarioId: string): Promise<void> {
        const producto = await this.productoModel.findById(productoId).exec();
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        if (producto.usuario.toString() !== usuarioId) {
            throw new Error('No tienes permiso para eliminar este producto');
        }
        await this.productoModel.findByIdAndDelete(productoId).exec();
    }
}
