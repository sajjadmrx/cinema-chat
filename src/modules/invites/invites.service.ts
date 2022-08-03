import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InvitesRepository } from './invites.repository';
import { InviteCreateDto } from './dtos/create.dto';
import { RoomsRepository } from '../rooms/rooms.repository';
import { ResponseMessages } from '../../shared/constants/response-messages.constant';
import { Room } from 'src/shared/interfaces/room.interface';
import { Invite, InviteWithRoom } from 'src/shared/interfaces/invite.interface';
import * as moment from 'moment';

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);

  constructor(
    private invitesRepo: InvitesRepository,
    private roomsRepository: RoomsRepository,
  ) {}

  async create(input: InviteCreateDto, userId: number): Promise<string> {
    try {
      const room: Room | null = await this.roomsRepository.getById(
        input.roomId,
      );
      if (!room) throw new BadRequestException(ResponseMessages.ROOM_NOT_FOUND);
      //Todo: Check Member

      const invite: Invite = await this.invitesRepo.create({
        inviterId: userId,
        expires_at: input.expires_at,
        max_use: input.max_use,
        roomId: input.roomId,
        isForEver: input.isForEver,
      });

      return invite.slug;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findRoom(slug: string): Promise<number> {
    try {
      const invite: InviteWithRoom | null = await this.invitesRepo.getBySlug(
        slug,
      );
      if (!invite) throw new NotFoundException(ResponseMessages.INVALID_INVITE);

      if (!invite.room)
        throw new NotFoundException(ResponseMessages.ROOM_NOT_FOUND);

      if (invite.max_use != 0)
        if (invite.max_use == invite.uses || invite.max_use < invite.uses)
          throw new BadRequestException(ResponseMessages.USED_MAXIMUM);

      if (!invite.isForEver) {
        if (moment(invite.expires_at).isBefore())
          throw new BadRequestException(ResponseMessages.EXPIRED_TIME);
      }

      await this.invitesRepo.updateUsesById(invite.inviteId);

      return invite.room.roomId;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
