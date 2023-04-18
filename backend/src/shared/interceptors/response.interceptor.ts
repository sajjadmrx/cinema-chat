import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseFormat } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> | Promise<Observable<ResponseFormat<T>>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    return next.handle().pipe(
      map((data: any) => {
        const statusCode =
          data.statusCode || context.switchToHttp().getResponse().statusCode;
        delete data.statusCode;
        response.status(statusCode);
        return {
          statusCode,
          ...data,
        };
      }),
    );
  }
}
