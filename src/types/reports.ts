export interface IDetalleFactura {
    codigoPrincipal: string;
    descripcion: string;
    cantidad: string;
    descuento: string;
    precioUnitario: string;
    totalSinImpuesto: string;
}

export interface IFormaPagoFactura {
    formaPago: string;
    valor: string;
}

export interface IDatoAdicionalFactura {
    nombre: string;
    valor: string;
}

export interface IFacturaInfo {
    razonSocial: string;
    ruc: string;
    nombreComercial: string;
    numeroFactura: string;
    direccionEstablecimiento: string;
    contribuyenteEspecial: string;
    obligadoContabilidad: string;
    contribuyenteRimpe: boolean;
    claveAcceso: string;
    ambiente: string;
    tipoEmision: string;
    razonCliente: string;
    tipoIdentificacionCliente: string;
    identificacionCliente: string;
    direccionCliente: string;
    telefonoCliente: string;
    emailCliente: string;
    fecha: string;
    subTotalCero: string;
    subTotalIva: string;
    subTotalNoImpuesto: string;
    subTotalExcento: string;
    valorDescuento: string;
    subTotalSinImpuesto: string;
    valorIva: string;
    valorTotal: string;
    detalles: IDetalleFactura[];
    formasPago: IFormaPagoFactura[];
    datosAdicionales: IDatoAdicionalFactura[];
    pathPdf: string;
}