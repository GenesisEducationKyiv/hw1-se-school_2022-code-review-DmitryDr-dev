import { Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { ICustomLoggerService } from '../../custom-logger/service';

@Catch(RpcException)
export class ExceptionFilter {
  constructor(private readonly loggerService: ICustomLoggerService) {}

  public async catch(exception: RpcException): Promise<Observable<any>> {
    await this.loggerService.error({
      name: this.constructor.name,
      timeStamp: new Date().toISOString(),
      message: exception.message,
      type: 'error',
    });

    return throwError(() => exception.getError());
  }
}
