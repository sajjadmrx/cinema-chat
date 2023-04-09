import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';
import { ChatGateway } from '../chat.gateway';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import { Socket } from 'socket.io';
import { Member } from '../../../shared/interfaces/member.interface';
import {
  CbFetchCurrentPlayingPayload,
  FetchCurrentPlayingPayload,
} from '../payloads/fetchCurrentPlaying.payload';
import { TogglePlayPayload } from '../payloads/togglePlay.payload';

@AsyncApiService()
export class StreamEmit {
  constructor(
    @Inject(forwardRef(() => ChatGateway)) private chatGateway: ChatGateway,
  ) {}

  @AsyncApiSub({
    channel: SocketKeys.STREAM_FETCH_CURRENT_PLAYING,
    tags: [{ name: 'stream' }],
    description:
      'Fetching current playing movie information from the room manager (owner)',
    message: {
      name: SocketKeys.STREAM_FETCH_CURRENT_PLAYING,
      payload: { type: FetchCurrentPlayingPayload },
    },
  })
  fetchCurrentPlaying(userSocket: Socket, member: Member) {
    userSocket.emit(SocketKeys.STREAM_FETCH_CURRENT_PLAYING, {
      cbTarget: member.userId,
      roomId: member.roomId,
      cbEvent: SocketKeys.STREAM_CB_CURRENT_PLAYING,
    });
  }

  @AsyncApiSub({
    channel: SocketKeys.STREAM_CB_CURRENT_PLAYING,
    tags: [{ name: 'stream' }],
    description:
      'Callback function for fetching current playing movie information',
    message: {
      name: SocketKeys.STREAM_CB_CURRENT_PLAYING,
      payload: { type: CbFetchCurrentPlayingPayload },
    },
  })
  cbFetchCurrentPlaying(targetSocket: Socket, data: any) {
    targetSocket.emit(SocketKeys.STREAM_CB_CURRENT_PLAYING, {
      ...data,
    });
  }

  @AsyncApiSub({
    channel: SocketKeys.STREAM_TOGGLE_PLAY,
    tags: [{ name: 'stream' }],
    description: 'Toggling play/pause state for media playback',
    message: {
      name: SocketKeys.STREAM_TOGGLE_PLAY,
      payload: { type: TogglePlayPayload },
    },
  })
  togglePlay(socket: Socket, roomId: string, data: TogglePlayPayload) {
    socket.to(roomId).emit(SocketKeys.STREAM_TOGGLE_PLAY, data);
  }
}
