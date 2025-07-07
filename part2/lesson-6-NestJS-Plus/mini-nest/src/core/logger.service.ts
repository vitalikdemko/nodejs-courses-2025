import { Injectable } from './decorators/injectable';

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log('[Logger]', message);
  }
}