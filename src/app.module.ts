import { Module } from '@nestjs/common';
import { ClienteModule } from './cliente/cliente.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportesModule } from './reportes/reportes.module';
import { PrinterModule } from './printer/printer.module';
import { UploadModule } from './upload/upload.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmpresaModule } from './empresa/empresa.module';
import { GeneralService } from './general/general.service';
import { GeneralModule } from './general/general.module';

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
        SubscriberModule,
        AuthModule,
        UserModule,
        EmpresaModule,
        GeneralModule
    ],
})
export class AppModule { }
