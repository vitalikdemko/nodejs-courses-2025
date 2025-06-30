import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export const ZBody = (schema: ZodSchema) =>
  createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const result = await schema.safeParseAsync(request.body);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    return result.data;
  })();
