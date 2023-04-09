import {
  BadGatewayException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ChatGateway } from '../chat.gateway';
import { GetCurrentPlayingDto, StreamNowPlayingDto } from '../dtos/stream.dto';
import { Socket } from 'socket.io';
import { MembersRepository } from '../../members/repositories/members.repository';
import { MemberWithRoom } from '../../../shared/interfaces/member.interface';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { UserSocketManager } from '../userSocket.manager';
import { SocketKeys } from '../../../shared/constants/socket.keys';

@Injectable()
export class StreamEventService {
  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private membersRepository: MembersRepository,
    private userSocketManager: UserSocketManager,
  ) {}

  async getCurrentPlaying(data: GetCurrentPlayingDto, socket: Socket) {
    const userId = socket.data.userId;
    const member: MemberWithRoom | null =
      await this.membersRepository.getByRoomIdAndUserId(data.roomId, userId);
    if (!member)
      throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

    const ownerId = member.room.ownerId;
    if (ownerId === member.userId) throw new BadGatewayException();
    const ownerSocket = await this.userSocketManager.findSocketByUserId(
      ownerId,
    );
    if (!ownerSocket) {
      throw new ForbiddenException(); //todo better message
    }
    // todo move to stream.emit.ts
    ownerSocket.emit(SocketKeys.STREAM_FETCH_CURRENT_PLAYING, {
      cbTarget: member.userId,
      roomId: member.roomId,
      cbEvent: SocketKeys.STREAM_CB_CURRENT_PLAYING,
    });
  }

  async cbCurrentPlaying(data: StreamNowPlayingDto, socket: Socket) {
    try {
      const userId = socket.data.userId;
      const targetId = data.cbTarget;

      const member: MemberWithRoom | null =
        await this.membersRepository.getByRoomIdAndUserId(data.roomId, userId);

      if (!member || member.room.ownerId != userId) return; //only owner can emit

      if (data.cbTarget === member.userId) throw new BadGatewayException();

      const targetSocket = await this.userSocketManager.findSocketByUserId(
        targetId,
      );
      if (!targetSocket) return;
      delete data.cbTarget;
      // find movie
      targetSocket.emit(SocketKeys.STREAM_CB_CURRENT_PLAYING, { ...data });
    } catch (e) {
      throw e;
    }
  }
}
