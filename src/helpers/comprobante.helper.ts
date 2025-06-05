import { Empresa } from "src/empresa/schemas/empresa.schema";

export function GenerarClaveAcceso(
    fechaEmision: Date,
    tipoComprobante: string,
    numeroDocumentos: number,
    empresa: Empresa
): string {
    const aleatorio = numeroDocumentos.toString().padStart(8, '0');
    const aux = new Date(fechaEmision.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }))
    const secuencial = empresa.secuencialFactura.toString().padStart(9, '0');
    const dia = fechaEmision.getUTCDate().toString().padStart(2, '0');
    const mes = (fechaEmision.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() devuelve 0-11
    const anio = fechaEmision.getUTCFullYear().toString();
    let claveAcceso =
        dia +
        mes +
        anio +
        tipoComprobante +
        empresa.ruc +
        empresa.ambiente +
        empresa.establecimiento +
        empresa.puntoEmision +
        secuencial +
        aleatorio +
        empresa.tipoEmision
        ;
    claveAcceso = claveAcceso + obtenerSumaPorDigitos(invertirCadena(claveAcceso))
    return claveAcceso;
}

function invertirCadena(cadena: string): string {
    return cadena.split('').reverse().join('');
}

function obtenerSumaPorDigitos(cadena: string): number {
    let pivote = 2;
    let longitudCadena = cadena.length;
    let cantidadTotal = 0;
    for (let i = 0; i < longitudCadena; i++) {
        if (pivote === 8) {
            pivote = 2;
        }
        let temporal = Number(cadena.substring(i, i + 1));
        temporal *= pivote;
        pivote++;
        cantidadTotal += temporal;
    }
    cantidadTotal = 11 - cantidadTotal % 11;
    if (cantidadTotal == 11)
        cantidadTotal = 0;
    else if (cantidadTotal == 10)
        cantidadTotal = 1;
    return cantidadTotal;
}