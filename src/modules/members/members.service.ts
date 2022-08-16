import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ResponseMessages } from 'src/shared/constants/response-messages.constant';
import {
  Member,
  MemberPermissionType,
  MemberPermission,
  MemberWithRoom,
} from 'src/shared/interfaces/member.interface';
import { User } from 'src/shared/interfaces/user.interface';
import { MembersRepository } from './members.repository';
import { Room } from '../../shared/interfaces/room.interface';
import { UpdateCurrentMemberDto } from './dtos/update.dto';
import { ChatGateway } from '../chat/chat.gateway';
import { EmitKeysConstant } from '../../shared/constants/event-keys.constant';

@Injectable()
export class MembersService {
  private logger = new Logger(MembersRepository.name);

  constructor(
    private membersRep: MembersRepository,
    private chatGateway: ChatGateway,
  ) {}

  async find(page: number, limit: number) {
    const maxLimit: number = 10;
    if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
      page = 1;
      limit = maxLimit;
    }
    if (limit > maxLimit) limit = maxLimit;
    return this.membersRep.find(page, limit);
  }

  async joinRoom(
    roomId: number,
    inviteId: number | null,
    user: User,
  ): Promise<any> {
    try {
      //TODO: check Invite Id

      const memberWithRoom: MemberWithRoom | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, user.userId);

      if (memberWithRoom)
        throw new BadRequestException(ResponseMessages.MEMBER_EXISTS);

      const member: Member = await this.membersRep.create({
        roomId,
        userId: user.userId,
        inviteId,
      });

      delete member.id;

      //TODO add to ChatService
      const sockets = await this.chatGateway.server.sockets.fetchSockets();
      const socket = sockets.find((so) => so.data.userId == user.userId);
      if (socket) socket.join(roomId.toString());
      //end

      this.chatGateway.server
        .to(roomId.toString())
        .emit(EmitKeysConstant.NEW_MEMBER, member); //TODO: or send Message system!
      return ResponseMessages.OK;
    } catch (error: any) {
      this.logger.error(error, error.satck);
      throw error;
    }
  }

  async laveRoom(roomId: number, user: User) {
    try {
      const memberWithRoom: MemberWithRoom | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, user.userId);
      if (!memberWithRoom)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      const room: Room = memberWithRoom.room;
      if (room.ownerId == memberWithRoom.userId) {
        //TODO: no idea :D
        throw new BadRequestException('Soon');
      }

      const isDeleted: boolean = await this.membersRep.deleteByRoomIdAndUserId(
        roomId,
        memberWithRoom.userId,
      );
      if (isDeleted) {
        delete memberWithRoom.id;
        delete memberWithRoom.room;
        const member: Member = memberWithRoom;

        //TODO Add to Queue
        const socketsOnRoom =
          await this.chatGateway.server.sockets.fetchSockets();
        const socket = socketsOnRoom.find((s) => s.data.userId == user.userId);
        if (socket) socket.leave(memberWithRoom.roomId.toString());
        this.chatGateway.server
          .to(roomId.toString())
          .emit(EmitKeysConstant.LAVE, member);

        return ResponseMessages.SUCCESS;
      } else throw new InternalServerErrorException();
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async delete(roomId: number, memberId: number, requester: User) {
    try {
      const memberWithRoom: MemberWithRoom | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, memberId);
      if (!memberWithRoom)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      const room: Room = memberWithRoom.room;

      if (requester.userId == memberWithRoom.userId) {
        throw new BadRequestException(ResponseMessages.CANNOT_KICK_SELF);
      }

      if (room.ownerId == memberWithRoom.userId) {
        throw new BadRequestException(ResponseMessages.CANNOT_KICK_OWNER);
      }

      const isDeleted = await this.membersRep.deleteByRoomIdAndUserId(
        roomId,
        memberWithRoom.userId,
      );
      if (!isDeleted) throw new InternalServerErrorException();

      //TODO add To Queue
      const socketsOnRoom =
        await this.chatGateway.server.sockets.fetchSockets();
      const socket = socketsOnRoom.find((s) => s.data.userId == memberId);
      if (socket) socket.leave(memberWithRoom.roomId.toString());

      delete memberWithRoom.room;
      const member: Member = memberWithRoom;
      delete member.id;
      this.chatGateway.server
        .to(roomId.toString())
        .emit(EmitKeysConstant.KICK_MEMBER, {
          member: member,
          by: requester.userId,
        });

      return ResponseMessages.SUCCESS;
    } catch (e: any) {
      this.logger.error(e, e.stack);
      throw e;
    }
  }

  async updateMember(
    memberId: number, //target
    requester: MemberWithRoom, // requester
    input: UpdateCurrentMemberDto,
  ) {
    try {
      let memberWithRoom: MemberWithRoom | null =
        memberId == requester.userId
          ? requester
          : await this.membersRep.getByRoomIdAndUserId(
              requester.roomId,
              memberId,
            );
      if (!memberWithRoom)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      const oldPerms = memberWithRoom.permissions;
      const newPerms = input.permissions;

      const permissions: MemberPermissionType[] = [...new Set([...newPerms])];

      const validate: Array<boolean> = permissions.map((a) =>
        Object.keys(MemberPermission).includes(a),
      );
      if (validate.includes(false))
        throw new BadRequestException(ResponseMessages.INVALID_PERMISSION);

      const room: Room = requester.room;

      let hasAdministrator: boolean =
        requester.permissions.includes('ADMINISTRATOR');

      if (!hasAdministrator && oldPerms.toString() != newPerms.toString())
        throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

      if (
        !permissions.includes('ADMINISTRATOR') &&
        memberWithRoom.userId == room.ownerId
      )
        throw new BadRequestException(); //TODO: better message
      if (memberId == requester.userId && oldPerms.includes('ADMINISTRATOR')) {
        if (!permissions.includes('ADMINISTRATOR'))
          throw new BadRequestException('can not take Administrator your self'); //TODO: better Message
      }

      input.permissions = permissions;
      await this.membersRep.updateOne(
        memberWithRoom.roomId,
        memberWithRoom.userId,
        input,
      );
      this.chatGateway.server
        .to(room.roomId.toString())
        .emit(EmitKeysConstant.UPDATE_MEMBER, {
          ...input,
          userId: memberWithRoom.userId,
          by: requester.userId,
        });
      return ResponseMessages.SUCCESS;
    } catch (e: any) {
      this.logger.error(e, e.stack);
      throw e;
    }
  }
}
