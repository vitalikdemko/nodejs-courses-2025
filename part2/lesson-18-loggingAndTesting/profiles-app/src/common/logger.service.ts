import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger {
  log(message: string, meta?: any) { Logger.log({ message, ...meta }); }
  error(message: string, meta?: any) { Logger.error({ message, ...meta }); }
}