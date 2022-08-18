import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { InvitesRepository } from '../invites/invites.repository';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MembersService {
  private logger = new Logger(MembersRepository.name);

  constructor(
    private membersRep: MembersRepository,
    private chatGateway: ChatGateway,
    @Inject(forwardRef(() => InvitesRepository))
    private invitesRepository: InvitesRepository,
    private chatService: ChatService,
  ) {}

  async find(roomId: number, page: number, limit: number): Promise<Member[]> {
    const maxLimit: number = 10;
    if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
      page = 1;
      limit = maxLimit;
    }
    if (limit > maxLimit) limit = maxLimit;
    if (!Number(roomId)) return [];
    const members: Member[] = await this.membersRep.find(roomId, page, limit);
    return members;
  }

  async joinRoom(
    roomId: number,
    inviteId: number | null,
    user: User,
  ): Promise<any> {
    try {
      if (Number(inviteId)) {
        const invite = await this.invitesRepository.getById(inviteId);
        if (!invite)
          throw new NotFoundException(ResponseMessages.INVALID_INVITE);
        if (invite.roomId != roomId)
          throw new BadRequestException(ResponseMessages.INVALID_INVITE);
      }

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

      //Todo Maybe add to queue
      await this.chatService.findSocketByUserIdAndJoinToRoom(
        user.userId,
        roomId,
      );

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
        await this.chatService.findSocketByUserIdAndLaveFromRoom(
          user.userId,
          roomId,
        );
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

      await this.chatService.findSocketByUserIdAndLaveFromRoom(
        memberId,
        roomId,
      );

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
