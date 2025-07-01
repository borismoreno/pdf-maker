import { Injectable } from '@nestjs/common';
import { FacturaEmitida } from './schemas/facturaEmitida.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DetalleFacturaEmitida } from './schemas/detalleFacturaEmitida.schema';
import { FormaPagoFactura } from './schemas/formaPagoFactura.schema';
import { DatoAdicionalFactura } from './schemas/datoAdicionalFactura.schema';
import { ImpuestoComprobante } from './schemas/impuestoComprobante.schema';
import { ComprobanteDto, CreateFacturaDto } from './dto/create-factura.dto';
import { EmpresaService } from 'src/empresa/empresa.service';
import { UserService } from 'src/user/user.service';
import { ClienteService } from 'src/cliente/cliente.service';
import { GenerarClaveAcceso } from '../helpers/comprobante.helper';
import { getCurrentLocalDate } from 'src/helpers/date';
import { GetClientDto } from 'src/cliente/dto/get-client.dto';

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
        private impuestoComprobanteModel: mongoose.Model<ImpuestoComprobante>,
        private readonly empresaService: EmpresaService,
        private readonly userService: UserService,
        private readonly clienteService: ClienteService,
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

    async saveFactura(createFacturaDto: ComprobanteDto, usuarioId: string): Promise<void> {
        const { clienteId, fechaEmision, codigoDocumento } = createFacturaDto.factura;
        const user = await this.userService.findById(new mongoose.Types.ObjectId(usuarioId));
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const { empresa: empresaId } = user;
        const empresa = await this.empresaService.findById(empresaId);

        if (!empresa) {
            throw new Error('Empresa no encontrada');
        }

        const cliente = await this.clienteService.findClienteById(new mongoose.Types.ObjectId(clienteId));

        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        const numeroDocumentos = await this.facturaEmitidaModel.countDocuments({
            codDoc: codigoDocumento
        }).exec();

        const claveAcceso = GenerarClaveAcceso(new Date(fechaEmision), codigoDocumento, numeroDocumentos, empresa);

        console.log('claveAcceso', claveAcceso);

        const factura = new this.facturaEmitidaModel({
            contribuyenteEspecial: empresa.contribuyenteEspecial,
            contribuyenteRimpe: empresa.contribuyenteRimpe,
            ambiente: empresa.ambiente,
            tipoEmision: empresa.tipoEmision,
            razonSocial: empresa.razonSocial,
            nombreComercial: empresa.nombreComercial,
            ruc: empresa.ruc,
            claveAcceso: claveAcceso,
            codDoc: codigoDocumento,
            estab: empresa.establecimiento,
            ptoEmi: empresa.puntoEmision,
            secuencial: empresa.secuencialFactura,
            dirMatriz: empresa.direccionMatriz,
            fechaEmision,
            dirEstablecimiento: empresa.direccionEstablecimiento,
            obligadoContabilidad: empresa.obligadoContabilidad,
            tipoIdentificacionComprador: cliente.tipoIdentificacion,
            razonSocialComprador: cliente.razonSocial,
            identificacionComprador: cliente.numeroIdentificacion,
            moneda: 'DOLAR',
            estadoComprobante: 'PPR',

            // const newFactura = new this.facturaEmitidaModel(factura);
            // return await newFactura.save();
        });
        // const facturaGuardada = await factura.save();
        // const detalles = createFacturaDto.detalles.map((detalle) => {   
    }

    getCommonPipeline(ruc: string, pastYear?: boolean, startDateParam?: Date, endDateParam?: Date): mongoose.PipelineStage[] {
        const { startDate, endDate } = getCurrentLocalDate(pastYear);
        let pipeline: mongoose.PipelineStage[] = [
            {
                $addFields: {
                    date: {
                        $dateFromParts: {
                            'year': {
                                $toInt: {
                                    $substr: ['$fechaEmision', 6, -1]
                                }
                            },
                            'month': {
                                $toInt: {
                                    $substr: ['$fechaEmision', 3, 2]
                                }
                            },
                            'day': {
                                $toInt: {
                                    $substr: ['$fechaEmision', 0, 2]
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    ruc: ruc,
                    date: {
                        $gte: startDateParam ? startDateParam : startDate,
                        $lt: endDateParam ? endDateParam : endDate
                    }
                }
            }
        ];
        return pipeline;
    }

    async getTotalFacturasEmitidas(ruc: string, pastYear?: boolean, startDateParam?: Date, endDateParam?: Date): Promise<number> {
        let pipeline: mongoose.PipelineStage[] = this.getCommonPipeline(ruc, pastYear, startDateParam, endDateParam);
        pipeline.push(
            {
                $group: {
                    _id: null,
                    numeroFacturas: {
                        $sum: 1
                    }
                }
            }
        );
        const result = await this.facturaEmitidaModel.aggregate(pipeline).exec();

        return result.length > 0 ? result[0].numeroFacturas : 0;
    }

    async getImporteTotalEmitidasCurrentMonth(ruc: string, pastYear?: boolean, startDateParam?: Date, endDateParam?: Date): Promise<number> {
        let pipeline: mongoose.PipelineStage[] = this.getCommonPipeline(ruc, pastYear, startDateParam, endDateParam);

        pipeline.push(
            {
                $group: {
                    _id: null,
                    importeTotal: {
                        $sum: {
                            $toDouble: '$importeTotal'
                        }
                    },
                }
            }
        )

        const result = await this.facturaEmitidaModel.aggregate(pipeline).exec();

        return result.length > 0 ? result[0].importeTotal : 0;
    }

    async getNumeroNuevosClientesCurrentMonth(ruc: string, pastYear?: boolean, startDateParam?: Date, endDateParam?: Date): Promise<number> {
        const { startDate, endDate } = getCurrentLocalDate(pastYear);
        let pipeline: mongoose.PipelineStage[] = [
            {
                $addFields: {
                    date: {
                        $dateFromParts: {
                            'year': {
                                $toInt: {
                                    $substr: ['$fechaEmision', 6, -1]
                                }
                            },
                            'month': {
                                $toInt: {
                                    $substr: ['$fechaEmision', 3, 2]
                                }
                            },
                            'day': {
                                $toInt: {
                                    $substr: ['$fechaEmision', 0, 2]
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    ruc: ruc
                }
            },
            {
                $group: {
                    _id: "$identificacionComprador",
                    firstDate: {
                        $min: "$date"
                    }
                }
            },
            {
                $match: {
                    firstDate: {
                        $gte: startDateParam ? startDateParam : startDate,
                        $lt: endDateParam ? endDateParam : endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    uniqueClients: {
                        $sum: 1
                    }
                }
            }
        ];

        const result = await this.facturaEmitidaModel.aggregate(pipeline).exec();

        return result.length > 0 ? result[0].uniqueClients : 0;
    }

    async getTopFiveClients(ruc: string, startDateParam?: Date, endDateParam?: Date): Promise<GetClientDto[]> {
        let pipeline: mongoose.PipelineStage[] = this.getCommonPipeline(ruc, false, startDateParam, endDateParam);
        pipeline.push(
            {
                $group: {
                    _id: "$identificacionComprador",
                    totalSum: {
                        $sum: {
                            $convert: {
                                input: "$importeTotal",
                                to: "double"
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    totalSum: -1
                }
            },
            {
                $limit: 5
            }
        );
        const result = await this.facturaEmitidaModel.aggregate(pipeline).exec();
        let clientes: GetClientDto[] = [];
        if (result.length > 0) {
            for (const element of result) {
                const cliente = await this.clienteService.getClienteByIdentificacion(element._id);
                cliente.totalMes = element.totalSum ?? 0;
                clientes.push(cliente);
            }
        }
        return clientes;
    }
}
