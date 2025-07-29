import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsController } from './sockets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketSchema } from './schemas/socket.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Socket', schema: SocketSchema }])
    ],
    controllers: [SocketsController],
    providers: [SocketsService],
    exports: [SocketsService]
})
export class SocketsModule { }
