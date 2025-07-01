import { Schema, Document, Types } from 'mongoose';

export const BookSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: false,
    }
})

export interface Book extends Document {
    id: string;
    title: string;
    description: string;
    author?: Schema.Types.ObjectId;
}