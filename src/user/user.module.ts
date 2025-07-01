import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { UserController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Usuario', schema: UserSchema }]),
        forwardRef(() => EmpresaModule), // Use forwardRef to avoid circular dependency
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule { }
