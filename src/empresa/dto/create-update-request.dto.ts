export interface ICreateUpdateEmpresaRequest {
    obligadoContabilidad?: boolean;
    activo?: boolean;
    razonSocial?: string;
    nombreComercial?: string;
    direccionMatriz?: string;
    direccionEstablecimiento?: string;
    contribuyenteRimpe?: boolean;
    ruc?: string;
    regimenMicroempresa?: boolean;
    ambiente?: number;
    tipoEmision?: number;
    establecimiento?: string;
    puntoEmision?: string;
    contribuyenteEspecial?: string;
    nombreNotificacion?: string;
    secuencialNotaCredito?: number;
    secuencialRetencion?: number;
    secuencialFactura?: number;
    claveFirma?: string;
    pathCertificado?: string;
    pathLogo?: string;
}