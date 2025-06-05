import { Controller, Post, Body } from '@nestjs/common';
import { XmlSignerService } from './xml-signer.service';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('sign')
export class XmlSignerController {
    constructor(
        private readonly xmlSigner: XmlSignerService,
        private readonly configService: ConfigService
    ) { }

    @Post()
    async signXml(@Body() body: { xml: string }) {
        const p12Buffer = readFileSync('src/certificados/boris_marco_moreno_guallichico.p12');
        const p12Password = this.configService.getOrThrow('CLAVE_FIRMA');

        try {
            const signedXml = await this.xmlSigner.signXml(
                body.xml,
                p12Buffer,
                p12Password,
            );
            return { signedXml };
        } catch (error) {
            throw new Error(`Error al firmar el XML: ${error.message}`);
        }
    }
}