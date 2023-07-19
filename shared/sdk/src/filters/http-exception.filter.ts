import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { BankException } from '../exceptions';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BankException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const code = exception?.getErrorCode();
    const message = exception?.getErrorMessage();
    const timestamp = new Date().getTime();

    response.status(statusCode).send({
      code,
      message,
      statusCode,
      timestamp,
      stack: exception.stack,
    });
  }
}
