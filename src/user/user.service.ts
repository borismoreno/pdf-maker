import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schemas/user.schema';
import mongoose from 'mongoose';
import { IGenericResponse } from 'src/types/general';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Usuario.name)
        private userModel: mongoose.Model<Usuario>
    ) { }

    async create(createUserDto: any): Promise<IGenericResponse> {
        const user = new this.userModel(createUserDto);
        await user.save();
        return {
            success: true,
            message: 'Usuario creado correctamente',
        };
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
