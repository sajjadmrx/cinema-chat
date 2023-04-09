import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ChatGateway } from '../chat.gateway';
import {
  GetCurrentPlayingDto,
  StreamNowPlayingDto,
  StreamPlayDto,
  StreamTogglePlay,
} from '../dtos/stream.dto';
import { Socket } from 'socket.io';
import { MembersRepository } from '../../members/repositories/members.repository';
import { MemberWithRoom } from '../../../shared/interfaces/member.interface';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { UserSocketManager } from '../userSocket.manager';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import { Movie } from '../../../shared/interfaces/movie.interface';
import { MoviesRepository } from '../../movies/movies.repository';
import { ChatEmit } from '../emits/chat.emit';
import { StreamEmit } from '../emits/stream.emit';
import { TogglePlayPayload } from '../payloads/togglePlay.payload';

@Injectable()
export class StreamEventService {
  private currentPlaying = new Map<string, Movie>();
  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private membersRepository: MembersRepository,
    private userSocketManager: UserSocketManager,
    private streamEmit: StreamEmit,
  ) {}

  async getCurrentPlaying(data: GetCurrentPlayingDto, socket: Socket) {
    try {
      const userId = socket.data.userId;
      const member: MemberWithRoom | null =
        await this.membersRepository.getByRoomIdAndUserId(data.roomId, userId);
      if (!member)
        throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

      const ownerId = member.room.ownerId;
      if (ownerId === member.userId) throw new BadGatewayException();
      const ownerSocket = await this.userSocketManager.findOneSocketByUserId(
        ownerId,
      );
      if (!ownerSocket)
        throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

      return this.streamEmit.fetchCurrentPlaying(ownerSocket as any, member);
    } catch (e) {
      throw e;
    }
  }

  async cbCurrentPlaying(data: StreamNowPlayingDto, socket: Socket) {
    try {
      const userId = socket.data.userId;
      const targetId = data.cbTarget;

      const member: MemberWithRoom | null =
        await this.membersRepository.getByRoomIdAndUserId(data.roomId, userId);

      if (!member || member.room.ownerId != userId) return; //only owner can emit

      if (data.cbTarget === member.userId) throw new BadRequestException();

      const targetSocket = await this.userSocketManager.findOneSocketByUserId(
        targetId,
      );
      if (!targetSocket) return;
      delete data.cbTarget;
      delete data.mediaId;
      const movie = this.currentPlaying.get(`${data.roomId}:playing`) || null;
      return this.streamEmit.cbFetchCurrentPlaying(targetSocket as any, {
        ...data,
        movie,
      });
    } catch (e) {
      throw e;
    }
  }

  async play(data: StreamPlayDto, socket: Socket, movieRepo: MoviesRepository) {
    try {
      const ownerId: number = socket.data.userId;
      const owner: MemberWithRoom | null =
        await this.membersRepository.getByRoomIdAndUserId(data.roomId, ownerId);

      if (!owner || owner.userId !== owner.room.ownerId)
        throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

      const movie: Movie = await movieRepo.getByMovieId(data.mediaId);

      if (!movie) throw new NotFoundException(ResponseMessages.INVALID_SRC);

      this.currentPlaying.set(`${data.roomId}:playing`, movie);

      socket.to(data.roomId.toString()).emit(SocketKeys.STREAM_PLAY, movie);
    } catch (e) {
      throw e;
    }
  }

  async onTogglePlay(data: StreamTogglePlay, socket: Socket) {
    const ownerId = socket.data.userId;
    const member: MemberWithRoom =
      await this.membersRepository.getByRoomIdAndUserId(data.roomId, ownerId);
    if (!member || ownerId !== member.room.ownerId)
      throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

    const movie = this.currentPlaying.get(`${data.roomId}:playing`);
    if (!movie) throw new NotFoundException(ResponseMessages.INVALID_SRC);
    return this.streamEmit.togglePlay(
      socket,
      member.roomId.toString(),
      data as TogglePlayPayload,
    );
  }
}
