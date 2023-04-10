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
  MemberPermission,
  MemberPermissionType,
  MemberWithRoom,
} from 'src/shared/interfaces/member.interface';
import { User } from 'src/shared/interfaces/user.interface';
import { Room } from '../../shared/interfaces/room.interface';
import { UpdateCurrentMemberDto } from './dtos/update.dto';
import { InvitesRepository } from '../invites/invites.repository';
import { ChatService } from '../socket/services/chat.service';
import { ChatEmit } from '../socket/emits/chat.emit';
import { RoomsRepository } from '../rooms/rooms.repository';
import { MembersRepository } from './repositories/members.repository';

@Injectable()
export class MembersService {
  private logger = new Logger(MembersService.name);

  constructor(
    private membersRep: MembersRepository,
    @Inject(forwardRef(() => InvitesRepository))
    private invitesRepository: InvitesRepository,
    private chatService: ChatService,
    private chatEmits: ChatEmit,
    private roomsRep: RoomsRepository,
  ) {}

  async find(roomId: number, page: number, limit: number): Promise<Member[]> {
    const maxLimit = 10;
    if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
      page = 1;
      limit = maxLimit;
    }
    if (limit > maxLimit) limit = maxLimit;
    if (!Number(roomId)) return [];
    return await this.membersRep.find(roomId, page, limit);
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

      const hasMember: Member | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, user.userId);

      if (hasMember)
        throw new BadRequestException(ResponseMessages.MEMBER_EXISTS);

      const member: Member = await this.membersRep.create({
        roomId,
        userId: user.userId,
        inviteId,
      });

      delete member.id;

      await this.chatService.findSocketByUserIdAndJoinToRoom(
        user.userId,
        roomId,
      );

      this.chatEmits.newMember(roomId, member); //TODO: or send Message system!

      return ResponseMessages.OK;
    } catch (error: any) {
      this.logger.error(error, error.satck);
      throw error;
    }
  }

  async laveRoom(roomId: number, user: User) {
    try {
      const member: Member | null = await this.membersRep.getByRoomIdAndUserId(
        roomId,
        user.userId,
      );
      if (!member)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      const room: Room = await this.roomsRep.getById(roomId);
      if (room.ownerId == member.userId) {
        //    TODO: no idea :D
        throw new BadRequestException('Soon');
      }

      const isDeleted: boolean = await this.membersRep.deleteByRoomIdAndUserId(
        roomId,
        member.userId,
      );
      if (isDeleted) {
        await this.chatService.findSocketByUserIdAndLaveFromRoom(
          user.userId,
          roomId,
        );
        this.chatEmits.laveMember(roomId, member);
        return ResponseMessages.SUCCESS;
      } else {
        throw new InternalServerErrorException();
      }
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async delete(roomId: number, memberId: number, requester: User) {
    try {
      const hasMember: Member | null =
        await this.membersRep.getByRoomIdAndUserId(roomId, memberId);
      if (!hasMember)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      //   const room: Room = hasMember.room;

      if (requester.userId == hasMember.userId) {
        throw new BadRequestException(ResponseMessages.CANNOT_KICK_SELF);
      }

      // if (room.ownerId == memberWithRoom.userId) {
      //   throw new BadRequestException(ResponseMessages.CANNOT_KICK_OWNER);
      // }
      //
      // const isDeleted = await this.membersRep.deleteByRoomIdAndUserId(
      //   roomId,
      // //  memberWithRoom.userId
      // );
      // if (!isDeleted) throw new InternalServerErrorException();

      await this.chatService.findSocketByUserIdAndLaveFromRoom(
        memberId,
        roomId,
      );

      // delete memberWithRoom.room;
      // const member: Member = memberWithRoom;
      // delete member.id;
      //
      // this.chatEmits.kickMember(String(roomId), member, requester.userId);

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
      const member: Member | null =
        memberId == requester.userId
          ? requester
          : await this.membersRep.getByRoomIdAndUserId(
              requester.roomId,
              memberId,
            );
      if (!member)
        throw new BadRequestException(ResponseMessages.MEMBER_NOT_FOUND);

      const oldPerms = member.permissions;
      const newPerms = input.permissions;

      const permissions: MemberPermissionType[] = [...new Set([...newPerms])];

      const validate: Array<boolean> = permissions.map((a) =>
        Object.keys(MemberPermission).includes(a),
      );
      if (validate.includes(false))
        throw new BadRequestException(ResponseMessages.INVALID_PERMISSION);

      const room: Room = requester.room;

      const hasAdministrator: boolean =
        requester.permissions.includes('ADMINISTRATOR');

      if (!hasAdministrator && oldPerms.toString() != newPerms.toString())
        throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

      if (
        !permissions.includes('ADMINISTRATOR') &&
        member.userId == room.ownerId
      )
        throw new BadRequestException(); //TODO: better message
      if (memberId == requester.userId && oldPerms.includes('ADMINISTRATOR')) {
        if (!permissions.includes('ADMINISTRATOR'))
          throw new BadRequestException('can not take Administrator your self'); //TODO: better Message
      }

      input.permissions = permissions;
      await this.membersRep.updateOne(member.roomId, member.userId, input);
      this.chatEmits.updateMember(
        String(room.roomId),
        member,
        requester.userId,
        input,
      );
      return ResponseMessages.SUCCESS;
    } catch (e: any) {
      this.logger.error(e, e.stack);
      throw e;
    }
  }

  async getMember(roomId: number, memberId: number): Promise<Member> {
    try {
      if (!Number(roomId) || !Number(memberId)) throw new BadRequestException();

      const member: Member | null = await this.membersRep.getByRoomIdAndUserId(
        roomId,
        memberId,
      );
      if (!member)
        throw new NotFoundException(ResponseMessages.MEMBER_NOT_FOUND);

      return member;
    } catch (e) {
      throw e;
    }
  }
}
