export class GetClientDto {
    _id?: string;
    activo: boolean;
    razonSocial: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    telefono: string;
    mail: string;
    direccion: string;
    totalMes?: number;
}