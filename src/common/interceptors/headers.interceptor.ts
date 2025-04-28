import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
    constructor(private readonly configService: ConfigService) { }

    private readonly frontendUrl = this.configService.getOrThrow('FRONTEND_URL');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // return next.handle().pipe(
        //     map((data) => {
        //         const response = context.switchToHttp().getResponse();
        //         response.setHeader('Access-Control-Allow-Origin', this.frontendUrl); // Header personalizado
        //         response.setHeader('Content-Type', 'application/json'); // Header personalizado
        //         return data;
        //     }),
        // );
        const response = context.switchToHttp().getResponse();

        // Configurar los encabezados antes de manejar la respuesta
        response.setHeader('Access-Control-Allow-Origin', this.frontendUrl);
        response.setHeader('Content-Type', 'application/json');

        return next.handle(); // No necesitas modificar los datos aquí si solo configuras encabezados
    }
}