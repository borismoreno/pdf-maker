import { Module } from '@nestjs/common';
import { ClienteModule } from './cliente/cliente.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportesModule } from './reportes/reportes.module';
import { PrinterModule } from './printer/printer.module';
import { UploadModule } from './upload/upload.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { SubscriberModule } from './subscriber/subscriber.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            // envFilePath: '.env',
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DB_URI),
        ClienteModule,
        ReportesModule,
        PrinterModule,
        UploadModule,
        ComprobanteModule,
        SubscriberModule
    ],
})
export class AppModule { }
