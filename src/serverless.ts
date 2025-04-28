import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { HeadersInterceptor } from './common/interceptors/headers.interceptor';

let server: Handler;

async function bootstrap() {
    const appConfig = new ConfigService();
    const configService = appConfig.getOrThrow('FRONTEND_URL');
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new HeadersInterceptor(app.get(ConfigService)));
    app.enableCors({
        origin: configService,
        credentials: true
    });
    app.use(cookieParser());
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
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
