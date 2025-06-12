import { Module } from '@nestjs/common';
import { XmlSignerService } from './xml-signer.service';
import { XmlSignerController } from './xml-signer.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
    providers: [XmlSignerService],
    exports: [XmlSignerService],
    controllers: [XmlSignerController],
    imports: [UploadModule]
})
export class XmlSignerModule { }
