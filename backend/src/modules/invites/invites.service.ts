import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InvitesRepository } from './invites.repository';
import { InviteCreateDto } from './dtos/create.dto';
import { RoomsRepository } from '../rooms/rooms.repository';
import { ResponseMessages } from '../../shared/constants/response-messages.constant';
import { Room } from 'src/shared/interfaces/room.interface';
import { Invite } from 'src/shared/interfaces/invite.interface';
import moment from 'moment';
import { Member } from 'src/shared/interfaces/member.interface';
import { MembersRepository } from '../members/repositories/members.repository';
import { ResponseFormat } from '../../shared/interfaces/response.interface';

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);

  constructor(
    private invitesRepo: InvitesRepository,
    private roomsRepository: RoomsRepository,
    private membersRepository: MembersRepository,
  ) {}

  async create(
    roomId: number,
    input: InviteCreateDto,
    userId: number,
  ): Promise<ResponseFormat<string>> {
    try {
      const room: Room | null = await this.roomsRepository.getById(roomId);
      if (!room) throw new NotFoundException(ResponseMessages.ROOM_NOT_FOUND);

      const member: Member | null =
        await this.membersRepository.getByRoomIdAndUserId(room.roomId, userId);

      if (!member)
        throw new BadRequestException(ResponseMessages.USER_NOT_MEMBER);

      const invite: Invite = await this.invitesRepo.create({
        inviterId: userId,
        expires_at: input.expires_at,
        max_use: input.max_use,
        roomId: roomId,
        isForEver: input.isForEver,
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: invite.slug,
      };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findRoom(slug: string): Promise<ResponseFormat<any>> {
    try {
      const invite: Invite | null = await this.invitesRepo.getBySlug(slug);
      if (!invite) throw new NotFoundException(ResponseMessages.INVALID_INVITE);

      if (invite.max_use != 0)
        if (invite.max_use == invite.uses || invite.max_use < invite.uses)
          throw new BadRequestException(ResponseMessages.USED_MAXIMUM);

      if (!invite.isForEver) {
        if (moment(invite.expires_at).isBefore())
          throw new BadRequestException(ResponseMessages.EXPIRED_TIME);
      }

      const room: Room | null = await this.roomsRepository.getById(
        invite.roomId,
      );
      if (!room) throw new NotFoundException(ResponseMessages.ROOM_NOT_FOUND);

      return {
        statusCode: HttpStatus.OK,
        data: {
          inviteId: invite.inviteId,
          ...room,
        },
      };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
