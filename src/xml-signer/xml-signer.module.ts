import { Module } from '@nestjs/common';
import { XmlSignerService } from './xml-signer.service';
import { XmlSignerController } from './xml-signer.controller';

@Module({
    providers: [XmlSignerService],
    exports: [XmlSignerService],
    controllers: [XmlSignerController]
})
export class XmlSignerModule { }
