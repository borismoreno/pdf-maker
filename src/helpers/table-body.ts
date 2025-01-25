import { TableCell } from 'pdfmake/interfaces';
import { IDatoAdicionalFactura, IDetalleFactura, IFormaPagoFactura } from 'src/types/reports';

const fillValue = '#E8E8E8';
export function buildDetallesTableBody(data: IDetalleFactura[]): TableCell[][] {
    let body: TableCell[][] = [];
    body.push([
        {
            text: 'Código',
            fillColor: fillValue,
            bold: true
        },
        {
            text: 'Descripción',
            fillColor: fillValue,
            bold: true
        },
        {
            text: 'Cantidad',
            fillColor: fillValue,
            bold: true
        },
        {
            text: 'Precio Unitario',
            fillColor: fillValue,
            bold: true
        },
        {
            text: 'Descuento',
            fillColor: fillValue,
            bold: true
        },
        {
            text: 'Total',
            fillColor: fillValue,
            bold: true
        }
    ]);
    data.forEach(function (row) {
        let dataRow: TableCell[] = [];

        dataRow.push(row.codigoPrincipal, row.descripcion, row.cantidad, row.precioUnitario, row.descuento, row.totalSinImpuesto);
        body.push(dataRow);
    });
    return body;
}

export function buildFormasPagoTableBody(data: IFormaPagoFactura[]): TableCell[][] {
    let body: TableCell[][] = [];
    body.push([
        {
            text: 'Método de Pago',
            fillColor: fillValue,
            bold: true
        },
        {
            text: 'Valor',
            fillColor: fillValue,
            bold: true
        }
    ]);
    data.forEach(function (row) {
        let dataRow: TableCell[] = [];

        dataRow.push(row.formaPago, row.valor);
        body.push(dataRow);
    });
    return body;
}

export function buildDatosAdicionalesTableBody(data: IDatoAdicionalFactura[]): TableCell[][] {
    let body: TableCell[][] = [];
    body.push([
        {
            text: 'Nombre Adicional',
            fillColor: fillValue,
            bold: true
        },
        {
            text: 'Valor Adicional',
            fillColor: fillValue,
            bold: true
        }
    ]);
    data.forEach(function (row) {
        let dataRow: TableCell[] = [];

        dataRow.push(row.nombre, row.valor);
        body.push(dataRow);
    });
    return body;
}