import { BankException } from '@bank/sdk';
import { HttpStatus } from '@nestjs/common';

export class NotFoundException extends BankException {
  constructor() {
    super('resource_not_found', 'Not found', HttpStatus.NOT_FOUND);
  }
}
