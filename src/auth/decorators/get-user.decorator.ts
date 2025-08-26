// approval_flow_backend/src/auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '../../database/entities/usuario.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Usuario => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);