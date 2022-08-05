import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ResponseMessages } from 'src/shared/constants/response-messages.constant';
import {
  Member,
  MemberPermissions,
  MemberWithRoom,
} from 'src/shared/interfaces/member.interface';
import { User } from 'src/shared/interfaces/user.interface';
import { MembersRepository } from './members.repository';
import { Room } from '../../shared/interfaces/room.interface';

@Injectable()
export class MembersService {
  private logger = new Logger(MembersRepository.name);

  constructor(private membersRep: MembersRepository) {}

  async joinRoom(
    roomId: number,
    inviteId: number | null,
    user: User,
  ): Promise<any> {
    try {
      //TODO: check Invite Id

      const memberExists: MemberWithRoom | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, user.userId);

      if (memberExists)
        throw new BadRequestException(ResponseMessages.MEMBER_EXISTS);

      const member: Member = await this.membersRep.create({
        roomId,
        userId: user.userId,
        inviteId,
      });

      //TODO: Send Welcome Message or Add To Queue

      return ResponseMessages.OK;
    } catch (error: any) {
      this.logger.error(error, error.satck);
      throw error;
    }
  }

  async laveRoom(roomId: number, user: User) {
    try {
      const member: MemberWithRoom | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, user.userId);
      if (!member)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      const room: Room = member.room;
      if (room.ownerId == member.userId) {
        //TODO: no idea :D
        throw new BadRequestException('Soon');
      }

      const isDeleted: boolean = await this.membersRep.deleteByRoomIdAndUserId(
        roomId,
        member.userId,
      );
      if (isDeleted) {
        //TODO: Send Lave Message
        return ResponseMessages.SUCCESS;
      } else throw new InternalServerErrorException();
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async delete(roomId: number, memberId: number, currentUser: User) {
    try {
      const member: MemberWithRoom | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, memberId);
      if (!member)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      const room: Room = member.room;

      if (currentUser.userId == member.userId) {
        throw new BadRequestException(ResponseMessages.CANNOT_KICK_SELF);
      }

      if (room.ownerId == member.userId) {
        throw new BadRequestException(ResponseMessages.CANNOT_KICK_OWNER);
      }

      const isDeleted = await this.membersRep.deleteByRoomIdAndUserId(
        roomId,
        memberId,
      );
      if (!isDeleted) throw new InternalServerErrorException();

      //TODO: SEND KICK MESSAGE
      return ResponseMessages.SUCCESS;
    } catch (e: any) {
      this.logger.error(e, e.stack);
      throw e;
    }
  }
}
