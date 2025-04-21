import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HeadersInterceptor } from './common/interceptors/headers.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new HeadersInterceptor());
    app.enableCors();
    await app.listen(3000);
}
bootstrap();
