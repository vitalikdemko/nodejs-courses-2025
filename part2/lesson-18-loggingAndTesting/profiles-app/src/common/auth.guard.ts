import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const h = req.headers['authorization'] as string | undefined;
    if (h === 'Bearer test') return true;
    throw new UnauthorizedException();
  }
}