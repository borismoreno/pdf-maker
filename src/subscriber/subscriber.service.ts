import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from './schemas/subscriber.schema';
import mongoose from 'mongoose';
import { IGenericResponse } from 'src/types/general';

@Injectable()
export class SubscriberService {
    constructor(
        @InjectModel(Subscriber.name)
        private subscriberModel: mongoose.Model<Subscriber>
    ) { }
    async create(createSubscriberDto: CreateSubscriberDto): Promise<IGenericResponse> {
        if (!createSubscriberDto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createSubscriberDto.email)) {
            return {
                success: false,
                message: 'Email inválido',
            };
        }
        const subscriber = new this.subscriberModel(createSubscriberDto);
        await subscriber.save();
        return {
            success: true,
            message: 'Registro creado correctamente',
        };
    }

    async findAll(): Promise<Subscriber[]> {
        const subscribers = await this.subscriberModel.find().exec();
        return subscribers;
        // return `This action returns all subscriber`;
    }

    // findOne(id: number) {
    //     return `This action returns a #${id} subscriber`;
    // }

    // update(id: number, updateSubscriberDto: UpdateSubscriberDto) {
    //     return `This action updates a #${id} subscriber`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} subscriber`;
    // }
}
