import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpresaSchema } from './schemas/empresa.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Empresa', schema: EmpresaSchema }])],
    providers: [EmpresaService],
    exports: [EmpresaService],
})
export class EmpresaModule { }
