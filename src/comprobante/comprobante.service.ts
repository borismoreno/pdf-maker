import { Injectable } from '@nestjs/common';
import { FacturaEmitida } from './schemas/facturaEmitida.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Mongoose } from 'mongoose';
import { DetalleFacturaEmitida } from './schemas/detalleFacturaEmitida.schema';
import { FormaPagoFactura } from './schemas/formaPagoFactura.schema';
import { DatoAdicionalFactura } from './schemas/datoAdicionalFactura.schema';
import { ImpuestoComprobante } from './schemas/impuestoComprobante.schema';

@Injectable()
export class ComprobanteService {
    constructor(
        @InjectModel(FacturaEmitida.name)
        private facturaEmitidaModel: mongoose.Model<FacturaEmitida>,
        @InjectModel(DetalleFacturaEmitida.name)
        private detalleFacturaEmitidaModel: mongoose.Model<DetalleFacturaEmitida>,
        @InjectModel(FormaPagoFactura.name)
        private formaPagoFacturaModel: mongoose.Model<FormaPagoFactura>,
        @InjectModel(DatoAdicionalFactura.name)
        private datoAdicionalFacturaModel: mongoose.Model<DatoAdicionalFactura>,
        @InjectModel(ImpuestoComprobante.name)
        private impuestoComprobanteModel: mongoose.Model<ImpuestoComprobante>
    ) { }

    async getFacturaByClaveAcceso(claveAcceso: string): Promise<FacturaEmitida> {
        const factura = await this.facturaEmitidaModel.findOne({ claveAcceso }).exec();
        return factura;
    }

    async getDetallesFactura(facturaEmitida: mongoose.Types.ObjectId): Promise<DetalleFacturaEmitida[]> {
        const detalles = await this.detalleFacturaEmitidaModel.find({ facturaEmitida }).exec();
        return detalles;
    }

    async getFormasPagoFactura(facturaEmitida: mongoose.Types.ObjectId): Promise<FormaPagoFactura[]> {
        const formasPago = await this.formaPagoFacturaModel.find({ facturaEmitida }).exec();
        return formasPago;
    }

    async getDatosAdicionalesFactura(facturaEmitida: mongoose.Types.ObjectId): Promise<DatoAdicionalFactura[]> {
        const datosAdicionales = await this.datoAdicionalFacturaModel.find({ facturaEmitida }).exec();
        return datosAdicionales;
    }

    async getImpuestosComprobanteDetalle(facturaDetalleId: string): Promise<ImpuestoComprobante> {
        const impuestos = await this.impuestoComprobanteModel.findOne({ $and: [{ impuestoPadre: facturaDetalleId }, { tipoImpuesto: 'DET' }] }).exec();
        return impuestos;
    }
}
