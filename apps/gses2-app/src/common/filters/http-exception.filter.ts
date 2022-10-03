import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerClient: ClientProxy) {}

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.loggerClient.emit('error', {
      name: this.constructor.name,
      timeStamp: new Date().toISOString(),
      message: exception.message,
      stack: exception.stack,
      type: 'error',
    });
    response.status(status).end();
  }
}
