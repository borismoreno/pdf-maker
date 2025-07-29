import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types, ObjectId } from 'mongoose';
import { Socket } from './schemas/socket.schema';
import { IGenericResponse } from 'src/types/general';

@Injectable()
export class SocketsService {
    /**
     *
     */
    constructor(
        @InjectModel('Socket')
        private readonly socketModel: mongoose.Model<Socket>
    ) { }

    async save(connectionId: string, usuarioId: string): Promise<IGenericResponse> {
        await this.deleteAllSockets(usuarioId);
        const socket = new this.socketModel({
            connectionId,
            usuario: new Types.ObjectId(usuarioId) as unknown as ObjectId
        });
        await socket.save();
        return { success: true }
    }

    async deleteAllSockets(usuarioId: string): Promise<IGenericResponse> {
        const socket = await this.socketModel.deleteMany({ usuario: new Types.ObjectId(usuarioId) as unknown as ObjectId }).exec();
        if (socket.deletedCount === 0) {
            return { success: false, message: 'No se encontraron sockets para eliminar.' };
        }
        return { success: true };
    }

    async getConnectionIdByUserId(usuarioId: string): Promise<string> {
        const socket = await this.socketModel.findOne({ usuario: new Types.ObjectId(usuarioId) as unknown as ObjectId }).exec();
        if (!socket) {
            return '';
        }
        return socket.connectionId;
    }
}
