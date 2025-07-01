// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// @Schema()
// export class Author {
//     @Prop({ required: true })
//     nombre: string;
//     @Prop()
//     edad?: number;
// }

// export const AuthorSchema = SchemaFactory.createForClass(Author);
import { Schema, Document } from 'mongoose';


export interface Author extends Document {
    id: string;
    nombre: string;
    edad?: number;
}

export const AuthorSchema = new Schema<Author>({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    edad: {
        type: Number,
        required: false
    }
});