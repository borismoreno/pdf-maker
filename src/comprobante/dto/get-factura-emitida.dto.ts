export class GetFacturaEmitidaDto {
    id: string;
    claveAcceso: string;
    numeroFactura: string;
    fechaEmision: string;
    razonSocialCliente: string;
    identificacionCliente: string;
    importeTotal: number;
    estadoComprobante: string;
}