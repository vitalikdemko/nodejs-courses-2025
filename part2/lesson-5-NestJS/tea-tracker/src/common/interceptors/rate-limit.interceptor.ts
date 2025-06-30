import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import rateLimit from 'express-rate-limit';
import { BadRequestException } from '@nestjs/common';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hours
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.ip,
  handler: () => {
    throw new BadRequestException('Too many requests, pls try again later');
  },
});

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return new Observable((observer) => {
      limiter(req, res, (err: any) => {
        if (err) {
          observer.error(err);
        } else {
          next.handle().subscribe(observer);
        }
      });
    });
  }
}
