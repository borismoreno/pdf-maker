import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schemas/user.schema';
import mongoose from 'mongoose';
import { IGenericResponse } from 'src/types/general';
import { ICreateUpdateUsuarioRequest } from './dto/create-update-request.dto';
import { EmpresaService } from 'src/empresa/empresa.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('Usuario')
        private userModel: mongoose.Model<Usuario>,
        @Inject(forwardRef(() => EmpresaService))
        private readonly empresaService: EmpresaService
    ) { }

    // async create(createUserDto: any): Promise<IGenericResponse> {
    //     const user = new this.userModel(createUserDto);
    //     await user.save();
    //     return {
    //         success: true,
    //         message: 'Usuario creado correctamente',
    //     };
    // }

    async createUser(request: ICreateUpdateUsuarioRequest): Promise<IGenericResponse> {
        let empresaId: string;
        try {
            const empresa = await this.empresaService.createEmpresa({});
            if (!empresa) {
                throw new BadRequestException('No se pudo crear la empresa asociada al usuario');
            }
            empresaId = empresa._id.toString();
            const newUser = new this.userModel({
                rol: request.rol,
                nombre: request.nombre,
                email: request.email,
                telefono: request.telefono,
                password: await bcrypt.hash(request.password, 10),
                empresa: empresa._id, // Associate the user with the created company
            });

            await newUser.save();
            return {
                success: true,
                message: 'Usuario creado correctamente',
            };
        } catch (error) {
            await this.empresaService.deleteEmpresa(empresaId);
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((err: any) => err.message);
                throw new BadRequestException(messages.join(', '));
            }
            if (error.code === 11000) {
                // Duplicate key error
                throw new BadRequestException('El email ya está en uso');
            }
            throw new BadRequestException('Error al crear el usuario: ' + error.message);
        }

    }


    async findAll(): Promise<Usuario[]> {
        const users = await this.userModel.find().exec();
        return users;
    }

    async findById(id: mongoose.Types.ObjectId): Promise<Usuario | null> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            return null;
        }
        return user;
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            return null;
        }
        return user;
    }
}
