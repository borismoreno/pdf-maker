import { TDocumentDefinitions } from "pdfmake/interfaces";
import { facturaHeaderSection } from "./sections/factura-header.section";
import { INotaCreditoInfo } from "src/types/reports";
import { buildDatosAdicionalesNotaCreditoTableBody, buildDetallesNotaCreditoTableBody } from "src/helpers/table-body";

interface ReportOptions {
    notaCredito: INotaCreditoInfo;
}

export const getNotaCredito = async ({ notaCredito }: ReportOptions): Promise<TDocumentDefinitions> => {
    const docDefinition: TDocumentDefinitions = {
        header: await facturaHeaderSection({
            ruc: notaCredito.ruc,
            secuencial: notaCredito.numeroNotaCredito,
            fechaEmision: notaCredito.fecha,
            tipoDocumento: 'Nota de Crédito',
            claveAcceso: notaCredito.claveAcceso
        }),
        pageMargins: [20, 120, 20, 60],
        content: [
            {
                alignment: 'justify',
                columns: [
                    {
                        stack: [
                            `${notaCredito.razonSocial}`,
                            `RUC ${notaCredito.ruc}`,
                            `${notaCredito.nombreComercial}`,
                            {
                                stack: [
                                    `${notaCredito.direccionEstablecimiento}`,
                                    `Obligado a llevar Contabilidad ${notaCredito.obligadoContabilidad}`,
                                    `${notaCredito.contribuyenteRimpe ? 'CONTRIBUYENTE REGIMEN RIMPE' : 'CONTRIBUYENTE REGIMEN GENERAL'}`
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
                            `${notaCredito.claveAcceso}`,
                            `Ambiente: ${notaCredito.ambiente}`,
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
                                text: `${notaCredito.razonCliente}`,
                                fontSize: 12,
                                bold: true
                            },
                            `${notaCredito.tipoIdentificacionCliente} ${notaCredito.identificacionCliente}`,
                            `${notaCredito.direccionCliente}`,
                            `${notaCredito.telefonoCliente}`,
                            `${notaCredito.emailCliente}`
                        ],
                        fontSize: 10,
                    },
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        stack: [
                                            'Comprobante que se modifica:',
                                            'Fecha emisión (modificado):',
                                            'Razón de modificación:'
                                        ],
                                        fontSize: 10,
                                        bold: true
                                    },
                                    {
                                        stack: [
                                            `${notaCredito.comprobanteModificado}`,
                                            `${notaCredito.fechaEmisionModificado}`,
                                            `${notaCredito.motivoModificacion}`
                                        ],
                                        fontSize: 10,
                                        marginLeft: 10
                                    }
                                ]
                            }
                        ],
                        marginTop: 10
                    }
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
                    widths: [200, 50, '*', '*', '*'],

                    body: buildDetallesNotaCreditoTableBody(notaCredito.detalles)
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

                                    body: buildDatosAdicionalesNotaCreditoTableBody(notaCredito.datosAdicionales)
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
                                    `${notaCredito.subTotalCero === '0.00' ? '' : 'Subtotal 0%'}`,
                                    `${notaCredito.subTotalIva === '0.00' ? '' : 'Subtotal 15%'}`,
                                    `${notaCredito.subTotalNoImpuesto === '0.00' ? '' : 'Subtotal No Sujeto IVA'}`,
                                    `${notaCredito.subTotalExcento === '0.00' ? '' : 'Subtotal Excento IVA'}`,
                                    `${notaCredito.subTotalSinImpuesto === '0.00' ? '' : 'Subtotal sin Impuestos'}`,
                                    `${notaCredito.valorDescuento === '0.00' ? '' : 'Descuento'}`,
                                    `${notaCredito.valorIva === '0.00' ? '' : 'IVA 15%'}`,
                                    'TOTAL'
                                ],
                                fontSize: 10,
                                bold: true
                            },
                            {
                                stack: [
                                    `${notaCredito.subTotalCero === '0.00' ? '' : notaCredito.subTotalCero}`,
                                    `${notaCredito.subTotalIva === '0.00' ? '' : notaCredito.subTotalIva}`,
                                    `${notaCredito.subTotalNoImpuesto === '0.00' ? '' : notaCredito.subTotalNoImpuesto}`,
                                    `${notaCredito.subTotalExcento === '0.00' ? '' : notaCredito.subTotalExcento}`,
                                    `${notaCredito.subTotalSinImpuesto === '0.00' ? '' : notaCredito.subTotalSinImpuesto}`,
                                    `${notaCredito.valorDescuento === '0.00' ? '' : notaCredito.valorDescuento}`,
                                    `${notaCredito.valorIva === '0.00' ? '' : notaCredito.valorIva}`,
                                    `${notaCredito.valorTotal === '0.00' ? '' : notaCredito.valorTotal}`
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
    }
    return docDefinition;
}