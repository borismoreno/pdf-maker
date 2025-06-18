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
    const s3Url = process.env.S3_URL;
    const qrCodeDataURL = await qrcode.toDataURL(`${s3Url}pdf/${claveAcceso}`);
    const dataURL = await fetchImage(`${s3Url}logos/${ruc}.png`);
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