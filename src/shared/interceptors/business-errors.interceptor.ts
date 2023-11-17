/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from '../errors/business-errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(catchError(error => {
                if (error.type === BusinessError.NOT_FOUND) // 404
                    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
                else if (error.type === BusinessError.PRECONDITION_FAILED) // 412
                    throw new HttpException(error.message, HttpStatus.PRECONDITION_FAILED);
                else if (error.type === BusinessError.BAD_REQUEST) // 400
                    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
                else if (error.type === BusinessError.UNPROCESSABLE_ENTITY) // 422
                    throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
                else
                    throw error;
            }));
    }
}

