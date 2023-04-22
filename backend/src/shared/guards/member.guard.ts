import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../interfaces/user.interface';
import { Room } from '../interfaces/room.interface';
import { Member } from '../interfaces/member.interface';
import { ResponseMessages } from '../constants/response-messages.constant';
import { MembersRepository } from '../../modules/http/members/repositories/members.repository';

@Injectable()
export class CheckCurrentMember implements CanActivate {
  constructor(private membersRepo: MembersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const user: User = request.user;
      const room: Room = request.currentRoom;
      const member: Member | null = await this.membersRepo.getByRoomIdAndUserId(
        room.roomId,
        user.userId,
      );
      if (!member)
        throw new ForbiddenException(ResponseMessages.USER_NOT_MEMBER);

      request.currentMember = member;
      return true;
    } catch (e) {
      throw e;
    }
  }
}
