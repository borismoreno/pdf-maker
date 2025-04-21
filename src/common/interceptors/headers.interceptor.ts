import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse();
                response.setHeader('Access-Control-Allow-Origin', '*'); // Header personalizado
                response.setHeader('Content-Type', 'application/json'); // Header personalizado
                return data;
            }),
        );
    }
}