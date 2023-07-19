import { HttpException, HttpStatus } from '@nestjs/common';

export class BankException extends HttpException {
  constructor(code: string, message: string, status: HttpStatus, cause?: Error) {
    super({ code, message }, status, { cause });
  }

  getErrorCode(): string {
    return this.getResponse()['code'];
  }

  getErrorMessage(): string {
    return this.getResponse()['message'];
  }
}
