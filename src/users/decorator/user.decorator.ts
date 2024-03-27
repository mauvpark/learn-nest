import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const body = request.body;
    const queries = request.query ?? {};
    const attr = queries[data] as string | undefined;
    return attr ? body[attr] : null;
  },
);
