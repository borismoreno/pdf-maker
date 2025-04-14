import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberSchema } from './schemas/subscriber.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Subscriber', schema: SubscriberSchema }])],
    controllers: [SubscriberController],
    providers: [SubscriberService],
    exports: [SubscriberService],
})
export class SubscriberModule { }
