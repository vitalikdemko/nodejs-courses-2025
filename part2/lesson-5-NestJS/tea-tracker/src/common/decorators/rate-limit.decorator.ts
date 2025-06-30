import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
  mixin,
  BadRequestException,
} from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { Observable } from 'rxjs';

export function RateLimit(limit: number): MethodDecorator {
  @Injectable()
  class RateLimitInterceptor implements NestInterceptor {
    private limiter = rateLimit({
      windowMs: 60 * 60 * 1000,
      max: limit,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: any) => req.ip || 'unknown',
      handler: () => {
        throw new BadRequestException('Too many requests');
      },
    });

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();

      return new Observable((observer) => {
        this.limiter(req, res, (err: any) => {
          if (err) observer.error(err);
          else next.handle().subscribe(observer);
        });
      });
    }
  }

  const mixedInterceptor = mixin(RateLimitInterceptor);
  return UseInterceptors(mixedInterceptor);
}
