export class CreateFacturaDto {
    clienteId: string;
    fechaEmision: string;
    codigoDocumento: string;
}

export class DetalleFacturaDto {
    productoId: string;
    cantidad: number;
    descuento: number;
}

export class FormaPagoFacturaDto {
    formaPago: string;
    total: number;
    plazo: number;
    unidadTiempo: string;
}
export class DatoAdicionalFacturaDto {
    nombre: string;
    valor: string;
}
export class ComprobanteDto {
    factura: CreateFacturaDto;
    detalles: DetalleFacturaDto[];
    formasPago: FormaPagoFacturaDto[];
    datosAdicionales: DatoAdicionalFacturaDto[];
}
export class ComprobanteResponseDto {
    claveAcceso: string;
    estadoComprobante: string;
    mensaje: string;
    comprobante: ComprobanteDto;
}
export class ComprobanteResponseErrorDto {
    claveAcceso: string;
    estadoComprobante: string;
    mensaje: string;
    error: string;
}
export class ComprobanteResponseError {
    claveAcceso: string;
    estadoComprobante: string;
    mensaje: string;
    error: string;
}
export class ComprobanteResponse {
    claveAcceso: string;
    estadoComprobante: string;
    mensaje: string;
    error: string;
}