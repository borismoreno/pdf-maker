import { Content } from 'pdfmake/interfaces';
import * as qrcode from 'qrcode';

interface FacturaHeaderOptions {
    ruc: string;
    secuencial: string;
    fechaEmision: string;
    tipoDocumento: string;
    claveAcceso: string;
}

const fetchImage = async (uri: string) => {
    const response = await fetch(uri);
    let blob = await response.blob();
    let buffer = Buffer.from(await blob.arrayBuffer());
    return `data:${blob.type};base64,${buffer.toString('base64')}`;
}

export const facturaHeaderSection = async ({ ruc, secuencial, fechaEmision, tipoDocumento, claveAcceso }: FacturaHeaderOptions): Promise<Content> => {
    const qrCodeDataURL = await qrcode.toDataURL(`https://imageneschatecuador.s3.us-east-2.amazonaws.com/${claveAcceso}-pdf`);
    const dataURL = await fetchImage(`https://imageneschatecuador.s3.us-east-2.amazonaws.com/${ruc}.png`);
    const logo: Content = {
        alignment: 'justify',
        margin: [20, 20],
        columns: [
            {
                image: dataURL,
                width: 250,
                height: 75,
            },
            {
                stack: [
                    {
                        text: `${tipoDocumento}`,
                        style: {
                            bold: true
                        }
                    },
                    `${secuencial}`,
                    {
                        text: `${fechaEmision}`,
                        style: {
                            fontSize: 14
                        }
                    }
                ],
                fontSize: 20,
                marginTop: 5,
                marginLeft: 10
            },
            {
                image: qrCodeDataURL, width: 75, alignment: 'right'
            }
        ]
    }
    return logo
}