import {
  Member,
  MemberPermissions,
  MemberPermissionsType,
} from '../interfaces/member.interface';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { ResponseMessages } from '../constants/response-messages.constant';

export function CheckMemberPermissions(
  perms: Array<MemberPermissionsType>,
): any {
  class _checkMemberPermissions implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request: Request = context.switchToHttp().getRequest();
      const member: Member = request.currentMember;

      const hasPerm: Array<boolean> = perms.map((perm) =>
        member.permissions.includes(perm),
      );

      if (hasPerm.includes(true)) return true;

      throw new UnauthorizedException(ResponseMessages.PERMISSION_DENIED);
    }
  }

  return _checkMemberPermissions;
}