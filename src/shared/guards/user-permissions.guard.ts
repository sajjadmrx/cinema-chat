import {
  Member,
  MemberPermission,
  MemberPermissionType
} from "../interfaces/member.interface";
import { Request } from "express";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from "@nestjs/common";
import { User, UserPermissionType } from "../interfaces/user.interface";
import { ResponseMessages } from "../constants/response-messages.constant";

export function CheckUserPermissions(
  perms: Array<UserPermissionType>
): any {
  class _checkUserPermissions implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request: Request = context.switchToHttp().getRequest();
      const user: User = request.user;

      const hasPerm: Array<boolean> = perms.map((perm) =>
        user.permissions.includes(perm)
      );

      if (hasPerm.includes(true)) return true;

      throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);
    }
  }

  return _checkUserPermissions;
}
