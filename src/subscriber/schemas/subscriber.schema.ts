import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    autoIndex: true,
    toJSON: { virtuals: true }
})
export class Subscriber {
    @Prop()
    email: string;
    @Prop()
    fechaRegistro: string;
    @Prop()
    ip: string;
    @Prop()
    agente: string;
    @Prop()
    planInteres: string;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);