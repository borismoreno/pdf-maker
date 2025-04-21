import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
// import * as cors from 'cors';

let server: Handler;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    // expressApp.use(cors({
    //     origin: ['https://www.cancha360.com', 'http://localhost:4321'], // Allow all origins
    //     methods: 'GET,POST,OPTIONS',
    //     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    // }));
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
