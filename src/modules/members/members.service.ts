import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ResponseMessages } from 'src/shared/constants/response-messages.constant';
import { Member, MemberWithRoom } from 'src/shared/interfaces/member.interface';
import { User } from 'src/shared/interfaces/user.interface';
import { MembersRepository } from './members.repository';

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

      //   console.log(user);
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
}
