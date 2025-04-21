import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from './schemas/empresa.schema';
import mongoose from 'mongoose';

@Injectable()
export class EmpresaService {
    constructor(
        @InjectModel(Empresa.name)
        private empresaModel: mongoose.Model<Empresa>
    ) { }

    async findById(id: mongoose.Types.ObjectId): Promise<Empresa | null> {
        const user = await this.empresaModel.findById(id).exec();
        if (!user) {
            return null;
        }
        return user;
    }
}
