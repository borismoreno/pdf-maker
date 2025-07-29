import { Document, Schema } from "mongoose";

export interface Socket extends Document {
    id: string;
    connectionId: string;
    usuario: Schema.Types.ObjectId;
}

export const SocketSchema = new Schema<Socket>({
    connectionId: {
        type: String,
        required: [true, 'Connection Id es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    }
})