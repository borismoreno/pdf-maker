import { Module } from '@nestjs/common';
import { ClienteModule } from './cliente/cliente.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportesModule } from './reportes/reportes.module';
import { PrinterModule } from './printer/printer.module';
import { UploadModule } from './upload/upload.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmpresaModule } from './empresa/empresa.module';
import { GeneralModule } from './general/general.module';
import { ProductoModule } from './producto/producto.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { XmlSignerModule } from './xml-signer/xml-signer.module';

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
        AuthModule,
        UserModule,
        EmpresaModule,
        GeneralModule,
        ProductoModule,
        DashboardModule,
        XmlSignerModule
    ]
})
export class AppModule { }
