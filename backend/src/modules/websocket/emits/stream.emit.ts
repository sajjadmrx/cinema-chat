import { forwardRef, Inject } from '@nestjs/common';
import { AsyncApiService } from 'nestjs-asyncapi';
import { Gateway } from '../gateway';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import { Socket } from 'socket.io';
import { Member } from '../../../shared/interfaces/member.interface';
import { PlayerPayload } from '../payloads/player.payload';
import {
  WsEmitCallbackCurrentPlaying,
  WsEmitFetchCurrentPlaying,
  WsEmitStreamPlay,
  WsEmitStreamSeek,
  WsEmitToggleStream,
} from '../decorators/stream-emits.decorator';

@AsyncApiService()
export class StreamEmit {
  constructor(
    @Inject(forwardRef(() => Gateway)) private chatGateway: Gateway,
  ) {}

  @WsEmitFetchCurrentPlaying()
  fetchCurrentPlaying(userSocket: Socket, member: Member) {
    userSocket.emit(SocketKeys.STREAM_FETCH_CURRENT_PLAYING, {
      cbTarget: member.userId,
      roomId: member.roomId,
      cbEvent: SocketKeys.STREAM_CB_CURRENT_PLAYING,
    });
  }

  @WsEmitCallbackCurrentPlaying()
  cbFetchCurrentPlaying(targetSocket: Socket, data: any) {
    console.log('GET_CURRENT_PLAYING');
    targetSocket.emit(SocketKeys.STREAM_CB_CURRENT_PLAYING, {
      ...data,
    });
  }

  @WsEmitToggleStream()
  togglePlay(socket: Socket, roomId: string, data: PlayerPayload) {
    socket.to(roomId).emit(SocketKeys.STREAM_TOGGLE_PLAY, data);
  }

  @WsEmitStreamPlay()
  play(socket: Socket, roomId: string, src: string) {
    this.chatGateway.server.to(roomId).emit(SocketKeys.STREAM_PLAY, src);
  }

  @WsEmitStreamSeek()
  seek(socket: Socket, roomId: string, data: PlayerPayload) {
    socket.to(roomId).emit(SocketKeys.STREAM_SEEK, data);
  }
}
