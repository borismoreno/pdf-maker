import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { facturaHeaderSection } from './sections/factura-header.section';
import { buildDatosAdicionalesTableBody, buildDetallesTableBody, buildFormasPagoTableBody } from 'src/helpers/table-body';
import { IFacturaInfo } from 'src/types/reports';

interface ReportOptions {
    factura: IFacturaInfo;
}

export const getFactura = async ({ factura }: ReportOptions): Promise<TDocumentDefinitions> => {
    const docDefinition: TDocumentDefinitions = {
        header: await facturaHeaderSection({
            ruc: factura.ruc,
            secuencial: factura.numeroFactura,
            fechaEmision: factura.fecha,
            tipoDocumento: 'Factura',
            claveAcceso: factura.claveAcceso
        }),
        pageMargins: [20, 120, 20, 60],
        content: [
            {
                alignment: 'justify',
                columns: [
                    {
                        stack: [
                            `${factura.razonSocial}`,
                            `RUC ${factura.ruc}`,
                            `${factura.nombreComercial}`,
                            {
                                stack: [
                                    `${factura.direccionEstablecimiento}`,
                                    `Obligado a llevar Contabilidad ${factura.obligadoContabilidad}`,
                                    `${factura.contribuyenteRimpe ? 'CONTRIBUYENTE REGIMEN RIMPE' : 'CONTRIBUYENTE REGIMEN GENERAL'}`
                                ],
                                fontSize: 10,
                                bold: false
                            },
                        ],
                        fontSize: 11,
                        bold: true
                    },
                    {
                        stack: [
                            'Autorización',
                            'Número:',
                            `${factura.claveAcceso}`,
                            `Ambiente: ${factura.ambiente}`,
                            'Emisión: NORMAL',
                        ],
                        fontSize: 9,
                    }
                ],
                marginBottom: 10
            },
            {
                canvas: [
                    {
                        type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 0.2
                    }
                ]
            },
            {
                alignment: 'justify',
                columns: [
                    {
                        stack: [
                            {
                                text: `${factura.razonCliente}`,
                                fontSize: 12,
                                bold: true
                            },
                            `${factura.tipoIdentificacionCliente} ${factura.identificacionCliente}`,
                            `${factura.direccionCliente}`,
                            `${factura.telefonoCliente}`,
                            `${factura.emailCliente}`
                        ],
                        fontSize: 10
                    },
                    {
                        stack: [
                            {
                                layout: 'headerLineOnly',
                                table: {
                                    headerRows: 1,
                                    widths: [180, '*'],

                                    body: buildFormasPagoTableBody(factura.formasPago)
                                },
                                fontSize: 10,
                                alignment: 'left'
                            }
                        ]
                    },
                ],
                marginTop: 10,
                marginBottom: 10
            },
            {
                canvas: [
                    {
                        type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 0.2
                    }
                ]
            },
            {
                layout: 'headerLineOnly',
                table: {
                    headerRows: 1,
                    widths: [50, 200, 50, '*', '*', '*'],

                    body: buildDetallesTableBody(factura.detalles)
                },
                margin: 20,
                fontSize: 10,
                alignment: 'left'
            },
            {
                canvas: [
                    {
                        type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 0.2
                    }
                ]
            },
            {
                alignment: 'justify',
                columns: [
                    {
                        stack: [
                            {
                                layout: 'headerLineOnly',
                                table: {
                                    headerRows: 1,
                                    widths: ['*', '*'],

                                    body: buildDatosAdicionalesTableBody(factura.datosAdicionales)
                                },
                                fontSize: 10,
                                alignment: 'left'
                            }
                        ]
                    },
                    {
                        columns: [
                            {
                                stack: [
                                    `${factura.subTotalCero === '0.00' ? '' : 'Subtotal 0%'}`,
                                    `${factura.subTotalIva === '0.00' ? '' : 'Subtotal 15%'}`,
                                    `${factura.subTotalNoImpuesto === '0.00' ? '' : 'Subtotal No Sujeto IVA'}`,
                                    `${factura.subTotalExcento === '0.00' ? '' : 'Subtotal Excento IVA'}`,
                                    `${factura.subTotalSinImpuesto === '0.00' ? '' : 'Subtotal sin Impuestos'}`,
                                    `${factura.valorDescuento === '0.00' ? '' : 'Descuento'}`,
                                    `${factura.valorIva === '0.00' ? '' : 'IVA 15%'}`,
                                    'TOTAL'
                                ],
                                fontSize: 10,
                                bold: true
                            },
                            {
                                stack: [
                                    `${factura.subTotalCero === '0.00' ? '' : factura.subTotalCero}`,
                                    `${factura.subTotalIva === '0.00' ? '' : factura.subTotalIva}`,
                                    `${factura.subTotalNoImpuesto === '0.00' ? '' : factura.subTotalNoImpuesto}`,
                                    `${factura.subTotalExcento === '0.00' ? '' : factura.subTotalExcento}`,
                                    `${factura.subTotalSinImpuesto === '0.00' ? '' : factura.subTotalSinImpuesto}`,
                                    `${factura.valorDescuento === '0.00' ? '' : factura.valorDescuento}`,
                                    `${factura.valorIva === '0.00' ? '' : factura.valorIva}`,
                                    `${factura.valorTotal === '0.00' ? '' : factura.valorTotal}`
                                ],
                                fontSize: 10,
                                alignment: 'right'
                            }
                        ],
                        marginLeft: 60,
                        marginRight: 10
                    }
                ],
                marginTop: 10
            }
        ]
    };

    return docDefinition;
}