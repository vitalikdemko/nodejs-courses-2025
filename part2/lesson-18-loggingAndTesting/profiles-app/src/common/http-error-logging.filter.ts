import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Catch(HttpException)
export class HttpErrorLoggingFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    const payload = exception.getResponse();
    this.logger.error('http.error', { status, payload });
    res.status(status).json(typeof payload === 'string' ? { message: payload } : payload);
  }
}