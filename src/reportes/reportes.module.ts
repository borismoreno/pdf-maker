import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { UploadModule } from 'src/upload/upload.module';
import { ComprobanteModule } from 'src/comprobante/comprobante.module';
import { ClienteModule } from 'src/cliente/cliente.module';

@Module({
    controllers: [ReportesController],
    imports: [
        PrinterModule,
        UploadModule,
        ComprobanteModule,
        ClienteModule
    ],
    providers: [ReportesService],
})
export class ReportesModule { }
