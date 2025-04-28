import { Controller, Get, Post, Body, Header, Response } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { Subscriber } from './schemas/subscriber.schema';
import { IGenericResponse } from 'src/types/general';

@Controller('subscriber')
export class SubscriberController {
    constructor(private readonly subscriberService: SubscriberService) { }

    @Post()
    async create(@Body() createSubscriberDto: CreateSubscriberDto): Promise<IGenericResponse> {
        return this.subscriberService.create(createSubscriberDto);
    }

    @Get()
    @Header('Access-Control-Allow-Origin', '*')
    async findAll(): Promise<Subscriber[]> {
        return this.subscriberService.findAll();
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.subscriberService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
    //     return this.subscriberService.update(+id, updateSubscriberDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.subscriberService.remove(+id);
    // }
}
