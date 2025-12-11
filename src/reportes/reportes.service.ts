import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ClienteService } from 'src/cliente/cliente.service';
import { GetClientDto } from 'src/cliente/dto/get-client.dto';
import { Cliente } from 'src/cliente/schemas/cliente.schema';
import { ComprobanteService } from 'src/comprobante/comprobante.service';
import { FacturaEmitida } from 'src/comprobante/schemas/facturaEmitida.schema';
import { ImpuestoComprobante } from 'src/comprobante/schemas/impuestoComprobante.schema';
import { NotaCreditoEmitida } from 'src/comprobante/schemas/notaCreditoEmitida.schema';
import { tiposIdentificacion, tiposFormaPago } from 'src/constants/comprobantes.constants';
import { PrinterService } from 'src/printer/printer.service';
import { getFactura } from 'src/reports/factura';
import { getNotaCredito } from 'src/reports/notaCredito';
import { IDatoAdicionalFactura, IDatoAdicionalNotaCredito, IDetalleFactura, IDetalleNotaCredito, IFacturaInfo, IFormaPagoFactura, INotaCreditoInfo } from 'src/types/reports';
import { UploadService } from 'src/upload/upload.service';

interface DetallesFactura {
    detalles: IDetalleFactura[];
    impuestos: ImpuestoComprobante[];
}

interface DetallesNotaCredito {
    detalles: IDetalleNotaCredito[];
    impuestos: ImpuestoComprobante[];
}

interface DetalleValores {
    subtotalCero: number;
    subtotalIva: number;
    subtotalNoImpuesto: number;
    subtotalExcento: number;
    subtotalSinImpuestos: number;
    valorIva: number;
    valorTotal: number;
}

@Injectable()
export class ReportesService {
    constructor(
        private readonly printerService: PrinterService,
        private readonly uploadService: UploadService,
        private readonly comprobanteService: ComprobanteService,
        private readonly clienteService: ClienteService
    ) { }

    async getBuffer(pdfDoc: PDFKit.PDFDocument) {
        return await new Promise<Buffer>((resolve) => {
            const buffs: unknown[] = [];
            pdfDoc.on('data', function (d) {
                buffs.push(d as readonly Uint8Array[]);
            });
            pdfDoc.on('end', function () {
                resolve(Buffer.concat(buffs as readonly Uint8Array[]));
            });
            pdfDoc.end();
        });
    }

    async getFactura(claveAcceso: string): Promise<string> {
        // const encontrado = await this.uploadService.obtenerArchivo(`${claveAcceso}-pdf`);
        // if (encontrado) return `${encontrado}`;
        const factura = await this.getFacturaInfo(claveAcceso);
        const docDefinition = await getFactura({
            factura
        });
        const pdfDoc = this.printerService.createPdf(docDefinition);
        const buffs = await this.getBuffer(pdfDoc);
        const res = await this.uploadService.upload(`pdf/${factura.claveAcceso}`, buffs, 'application/pdf');
        return res;
    }

    async getFacturaTest(claveAcceso: string) {
        const docDefinition = await getFactura({
            factura: await this.getFacturaInfo(claveAcceso)
        });
        const pdfDoc = this.printerService.createPdf(docDefinition);
        return pdfDoc;
    }

    async getNotaCredito(claveAcceso: string): Promise<string> {
        // const encontrado = await this.uploadService.obtenerArchivo(`${claveAcceso}-pdf`);
        // if (encontrado) return `${encontrado}`;
        const notaCredito = await this.getNotaCreditoInfo(claveAcceso);
        const docDefinition = await getNotaCredito({
            notaCredito
        });
        const pdfDoc = this.printerService.createPdf(docDefinition);
        const buffs = await this.getBuffer(pdfDoc);
        const res = await this.uploadService.upload(`pdf/${notaCredito.claveAcceso}`, buffs, 'application/pdf');
        return res;
    }

    async getNotaCreditoTest(claveAcceso: string) {
        const docDefinition = await getNotaCredito({
            notaCredito: await this.getNotaCreditoInfo(claveAcceso)
        });
        const pdfDoc = this.printerService.createPdf(docDefinition);
        return pdfDoc;
    }

    getValores(impuestos: ImpuestoComprobante[]): DetalleValores {
        let subtotalCero = 0;
        let subtotalExcento = 0;
        let subtotalIva = 0;
        let subtotalNoImpuesto = 0;
        let subtotalSinImpuestos = 0;
        let valorIva = 0;
        let valorTotal = 0;
        for (const impuesto of impuestos) {
            switch (impuesto.codigoPorcentaje) {
                case '4':
                    subtotalIva += Number(impuesto.baseImponible);
                    subtotalSinImpuestos += Number(impuesto.baseImponible);
                    valorIva += Number(impuesto.valor);
                    break;
                case '0':
                    subtotalCero += Number(impuesto.baseImponible);
                    subtotalSinImpuestos += Number(impuesto.baseImponible);
                    break;
                case '6':
                    subtotalNoImpuesto += Number(impuesto.baseImponible);
                    subtotalSinImpuestos += Number(impuesto.baseImponible);
                    break;
                case '7':
                    subtotalExcento += Number(impuesto.baseImponible);
                    subtotalSinImpuestos += Number(impuesto.baseImponible);
                    break;
                default:
                    break;
            }
        }
        valorTotal = valorIva + subtotalSinImpuestos;
        return {
            subtotalCero,
            subtotalExcento,
            subtotalIva,
            subtotalNoImpuesto,
            subtotalSinImpuestos,
            valorIva,
            valorTotal
        };
    }

    async getNotaCreditoInfo(claveAcceso: string): Promise<INotaCreditoInfo> {
        let notaCreditoInfo: INotaCreditoInfo = null
        const notaCredito = await this.comprobanteService.getNotaCreditoByClaveAcceso(claveAcceso)
        if (notaCredito) {
            const facturaEmitida = await this.comprobanteService.getFacturaById(new mongoose.Types.ObjectId(notaCredito.facturaEmitida))
            if (facturaEmitida) {
                const cliente: GetClientDto = await this.clienteService.findClienteById(new mongoose.Types.ObjectId(facturaEmitida.cliente))
                const { detalles, impuestos } = await this.getDetallesNotaCredito(notaCredito);
                const { subtotalIva, subtotalCero, subtotalNoImpuesto, subtotalSinImpuestos, subtotalExcento, valorIva, valorTotal } = this.getValores(impuestos);
                let valorDescuento = 0;
                for (const detalle of detalles) {
                    valorDescuento += Number(detalle.descuento);
                }
                const datosAdicionales: IDatoAdicionalNotaCredito[] = await this.getDatosAdicionalesNotaCredito(notaCredito);
                notaCreditoInfo = {
                    ruc: notaCredito.ruc,
                    numeroNotaCredito: `${notaCredito.estab}-${notaCredito.ptoEmi}-${notaCredito.secuencial}`,
                    fecha: notaCredito.fechaEmision,
                    claveAcceso: notaCredito.claveAcceso,
                    razonSocial: notaCredito.razonSocial,
                    nombreComercial: notaCredito.nombreComercial,
                    direccionEstablecimiento: notaCredito.dirEstablecimiento,
                    contribuyenteEspecial: notaCredito.contribuyenteEspecial,
                    obligadoContabilidad: notaCredito.obligadoContabilidad,
                    contribuyenteRimpe: notaCredito.contribuyenteRimpe,
                    ambiente: notaCredito.ambiente === '2' ? 'PRODUCCION' : 'PRUEBAS',
                    razonCliente: notaCredito.razonSocialComprador,
                    tipoIdentificacionCliente: tiposIdentificacion.find(f => f.codigo === notaCredito.tipoIdentificacionComprador).descripcion,
                    identificacionCliente: notaCredito.identificacionComprador,
                    direccionCliente: cliente.direccion,
                    telefonoCliente: cliente.telefono,
                    emailCliente: cliente.mail.split(',').join('\n'),
                    comprobanteModificado: `${facturaEmitida.estab}-${facturaEmitida.ptoEmi}-${facturaEmitida.secuencial}`,
                    fechaEmisionModificado: facturaEmitida.fechaEmision,
                    motivoModificacion: notaCredito.motivo,
                    subTotalCero: subtotalCero.toFixed(2),
                    subTotalIva: subtotalIva.toFixed(2),
                    subTotalNoImpuesto: subtotalNoImpuesto.toFixed(2),
                    subTotalExcento: subtotalExcento.toFixed(2),
                    valorDescuento: valorDescuento.toFixed(2),
                    subTotalSinImpuesto: subtotalSinImpuestos.toFixed(2),
                    valorIva: valorIva.toFixed(2),
                    valorTotal: valorTotal.toFixed(2),
                    pathPdf: `https://imageneschatecuador.s3.us-east-2.amazonaws.com/${notaCredito.claveAcceso}-pdf`,
                    detalles,
                    datosAdicionales
                }
            }
        }
        return notaCreditoInfo
    }

    async getFacturaInfo(claveAcceso: string): Promise<IFacturaInfo> {
        let facturaInfo: IFacturaInfo = null;
        const factura = await this.comprobanteService.getFacturaByClaveAcceso(claveAcceso);
        if (factura) {
            const cliente: GetClientDto = await this.clienteService.findClienteById(new mongoose.Types.ObjectId(factura.cliente))
            const { detalles, impuestos } = await this.getDetalles(factura);
            const { subtotalIva, subtotalCero, subtotalNoImpuesto, subtotalSinImpuestos, subtotalExcento, valorIva, valorTotal } = this.getValores(impuestos);
            const formasPago: IFormaPagoFactura[] = await this.getFormasPago(factura);
            let valorDescuento = 0;
            for (const detalle of detalles) {
                valorDescuento += Number(detalle.descuento);
            }
            const datosAdicionales: IDatoAdicionalFactura[] = await this.getDatosAdicionales(factura);
            facturaInfo = {
                razonSocial: factura.razonSocial,
                ruc: factura.ruc,
                nombreComercial: factura.nombreComercial,
                numeroFactura: `${factura.estab}-${factura.ptoEmi}-${factura.secuencial}`,
                direccionEstablecimiento: factura.dirEstablecimiento,
                contribuyenteEspecial: factura.contribuyenteEspecial,
                obligadoContabilidad: factura.obligadoContabilidad,
                contribuyenteRimpe: factura.contribuyenteRimpe,
                claveAcceso: factura.claveAcceso,
                ambiente: factura.ambiente === '2' ? 'PRODUCCION' : 'PRUEBAS',
                tipoEmision: factura.tipoEmision === '1' ? 'NORMAL' : '',
                razonCliente: factura.razonSocialComprador,
                tipoIdentificacionCliente: tiposIdentificacion.find(f => f.codigo === factura.tipoIdentificacionComprador).descripcion,
                identificacionCliente: factura.identificacionComprador,
                direccionCliente: cliente.direccion,
                telefonoCliente: cliente.telefono,
                emailCliente: cliente.mail.split(',').join('\n'),
                fecha: factura.fechaEmision,
                subTotalCero: subtotalCero.toFixed(2),
                subTotalIva: subtotalIva.toFixed(2),
                subTotalNoImpuesto: subtotalNoImpuesto.toFixed(2),
                subTotalExcento: subtotalExcento.toFixed(2),
                valorDescuento: valorDescuento.toFixed(2),
                subTotalSinImpuesto: subtotalSinImpuestos.toFixed(2),
                valorIva: valorIva.toFixed(2),
                valorTotal: valorTotal.toFixed(2),
                pathPdf: `https://imageneschatecuador.s3.us-east-2.amazonaws.com/${factura.claveAcceso}-pdf`,
                detalles,
                formasPago,
                datosAdicionales
            };
        }
        return facturaInfo;
    }

    async getDetallesNotaCredito(notaCredito: NotaCreditoEmitida): Promise<DetallesNotaCredito> {
        let detalles: IDetalleNotaCredito[] = [];
        const detallesRes = await this.comprobanteService.getDetallesNotaCredito(notaCredito._id);
        let impuestos: ImpuestoComprobante[] = [];
        if (detallesRes) {
            for (const detalle of detallesRes) {
                const impuesto = await this.comprobanteService.getImpuestosComprobanteDetalle(detalle._id);
                impuestos.push(impuesto);
                detalles.push({
                    descripcion: detalle.descripcion,
                    cantidad: detalle.cantidad,
                    descuento: detalle.descuento,
                    precioUnitario: detalle.precioUnitario,
                    totalSinImpuesto: detalle.precioTotalSinImpuesto
                })
            }
        }
        return { detalles, impuestos };
    }

    async getDetalles(factura: FacturaEmitida): Promise<DetallesFactura> {
        let detalles: IDetalleFactura[] = [];
        const detallesRes = await this.comprobanteService.getDetallesFactura(factura._id);
        let impuestos: ImpuestoComprobante[] = [];
        if (detallesRes) {
            for (const detalle of detallesRes) {
                const impuesto = await this.comprobanteService.getImpuestosComprobanteDetalle(detalle._id);
                impuestos.push(impuesto);
                detalles.push({
                    codigoPrincipal: detalle.codigoPrincipal,
                    descripcion: detalle.descripcion,
                    cantidad: detalle.cantidad,
                    descuento: detalle.descuento,
                    precioUnitario: detalle.precioUnitario,
                    totalSinImpuesto: detalle.totalSinImpuesto
                })
            }
        }
        return { detalles, impuestos };
    }

    async getFormasPago(factura: FacturaEmitida): Promise<IFormaPagoFactura[]> {
        const formasPago: IFormaPagoFactura[] = [];
        const formasPagoRes = await this.comprobanteService.getFormasPagoFactura(factura._id);
        if (formasPagoRes) {
            formasPagoRes.forEach(formaPago => {
                formasPago.push({
                    formaPago: tiposFormaPago.find(f => f.codigo === formaPago.formaPago).descripcion,
                    valor: formaPago.total
                });
            });
        }
        return formasPago;
    }

    async getDatosAdicionales(factura: FacturaEmitida): Promise<IDatoAdicionalFactura[]> {
        const datosAdicionales: IDatoAdicionalFactura[] = [];
        const datosAdicionalesRes = await this.comprobanteService.getDatosAdicionalesFactura(factura._id);
        if (datosAdicionales) {
            datosAdicionalesRes.forEach(datoAdicional => {
                datosAdicionales.push({
                    nombre: datoAdicional.nombreAdicional,
                    valor: datoAdicional.valorAdicional
                });
            });
        }
        return datosAdicionales;
    }

    async getDatosAdicionalesNotaCredito(notaCredito: NotaCreditoEmitida): Promise<IDatoAdicionalNotaCredito[]> {
        const datosAdicionales: IDatoAdicionalNotaCredito[] = [];
        const datosAdicionalesRes = await this.comprobanteService.getDatosAdicionalesNotaCredito(notaCredito._id);
        if (datosAdicionales) {
            datosAdicionalesRes.forEach(datoAdicional => {
                datosAdicionales.push({
                    nombre: datoAdicional.nombreAdicional,
                    valor: datoAdicional.valorAdicional
                });
            });
        }
        return datosAdicionales;
    }
}
