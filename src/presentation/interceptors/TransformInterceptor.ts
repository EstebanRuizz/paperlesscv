import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  size?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T[]>>
{
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T[]>> {
    return next
      .handle()
      .pipe(
        map(this.mapData.bind(this)),
        catchError(this.handleError.bind(this)),
      );
  }

  private mapData(data: T[] | T): Response<T[]> {
    return {
      size: Array.isArray(data) ? data.length : [data].length,
      data: Array.isArray(data) ? data : [data],
    };
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => ({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: error.message,
    }));
  }
}
