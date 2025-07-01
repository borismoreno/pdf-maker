import { Module, forwardRef } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpresaSchema } from './schemas/empresa.schema';
import { EmpresaController } from './empresa.controller';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Empresa', schema: EmpresaSchema }]),
        forwardRef(() => UserModule), // Use forwardRef to avoid circular dependency
    ],
    providers: [EmpresaService],
    exports: [EmpresaService],
    controllers: [EmpresaController],
})
export class EmpresaModule { }
