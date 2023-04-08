import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Member } from '../interfaces/member.interface';
import { Request } from 'express';

export const getMember = createParamDecorator(
  <T extends object>(keyname: keyof Member, ctx: ExecutionContext): T => {
    const request: Request = ctx.switchToHttp().getRequest();
    const member: Member = request.currentMember;
    if (keyname) return member[keyname] as T;
    else return member as T;
  },
);
