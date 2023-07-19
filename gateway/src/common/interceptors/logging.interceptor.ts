import { BankException } from '@bank/sdk';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(LoggingInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}

  public intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, headers } = req;

    if (url.includes('health')) {
      // return call$.handle().pipe();
    }

    // const ctx: string = `${this.userPrefix}${this.ctxPrefix} - ${method} - ${url}`;

    this.logger.debug(`[Incoming request] - ${method} - ${url}`, {
      method,
      body,
      headers,
    });

    return call$.handle().pipe(
      tap({
        next: (val: unknown): void => {
          this.logNext(val, context);
        },
        error: (err: Error): void => {
          this.logError(err, context);
        },
      }),
    );
  }

  private logNext(body: unknown, context: ExecutionContext): void {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url } = req;
    const { statusCode } = res;

    this.logger.debug(`[Outgoing response] - ${method} - ${url} - ${statusCode}`, {
      body,
    });
  }

  private logError(error: Error, context: ExecutionContext): void {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;

    if (!(error instanceof BankException)) {
      this.logger.error(`Something went wrong...`, error.stack, `${method} - ${url}`);
    }

    if (error instanceof BankException) {
      const statusCode: number = error.getStatus();
      const message: string = `[Outgoing response] - ${statusCode} - ${method} - ${url}`;

      if (statusCode <= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.warn(message, {
          method,
          url,
          error,
          body,
        });
      }

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          message,
          {
            method,
            url,
            body,
            error,
          },
          error.stack,
        );
      }
    }
  }
}
