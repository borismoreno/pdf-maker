import { Controller, Post, Body } from '@nestjs/common';
import { XmlSignerService } from './xml-signer.service';
import { ConfigService } from '@nestjs/config';

@Controller('sign')
export class XmlSignerController {
    constructor(
        private readonly xmlSigner: XmlSignerService,
        private readonly configService: ConfigService
    ) { }

    @Post()
    async signXml(@Body() body: { xml: string, firma: string, password: string }) {
        try {
            const signedXml = await this.xmlSigner.signXmlEnhanced(
                body.xml,
                body.password,
                body.firma
            );
            return { signedXml };
        } catch (error) {
            throw new Error(`Error al firmar el XML: ${error.message}`);
        }
    }
}