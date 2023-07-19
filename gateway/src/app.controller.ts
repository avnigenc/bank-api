import { NotFoundException } from '@app/common/exception/not-found.exception';
import { Controller, Get } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  @InjectPinoLogger(AppController.name)
  private readonly logger: PinoLogger;

  @Get('/health')
  getHealth() {
    this.logger.info('log me');
    throw new NotFoundException();

    return {
      message: 'OK',
      timestamp: new Date().getTime(),
    };
  }
}
