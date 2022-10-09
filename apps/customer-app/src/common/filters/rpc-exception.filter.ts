import { Catch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class ExceptionFilter {
  constructor(private readonly loggerClient: ClientProxy) {}

  public async catch(exception: RpcException): Promise<Observable<any>> {
    await this.loggerClient.emit('error', {
      name: this.constructor.name,
      timeStamp: new Date().toISOString(),
      message: exception.message,
      type: 'error',
    });

    return throwError(() => exception.getError());
  }
}
