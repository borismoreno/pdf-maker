import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HeadersInterceptor } from './common/interceptors/headers.interceptor';
import { ConfigService } from '@nestjs/config';

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
    await app.listen(3000);
}
bootstrap();
