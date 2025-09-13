import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Response as ExpressResponse } from 'express'

export interface Response<T> {
  data: T
  statusCode: number
  message: string
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const res = context.switchToHttp().getResponse<ExpressResponse>()
    const { statusCode } = res
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const { message = 'successfully', ...rest } = data
          return { data: rest, statusCode, message: message as string }
        }
        return { data, statusCode, message: 'successfully' }
      }),
    )
  }
}
