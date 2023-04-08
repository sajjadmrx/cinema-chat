import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../interfaces/user.interface';

export const getUser = createParamDecorator(
  (keyname: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user: User = request.user as User;
    return keyname ? user[keyname] : user;
  },
);
