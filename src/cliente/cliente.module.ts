import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteSchema } from './schemas/cliente.schema';
import { GeneralModule } from 'src/general/general.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Cliente', schema: ClienteSchema }]),
        GeneralModule
    ],
    controllers: [ClienteController],
    providers: [ClienteService],
    exports: [ClienteService]
})
export class ClienteModule { }
