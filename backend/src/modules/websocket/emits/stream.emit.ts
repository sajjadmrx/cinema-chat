import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';
import { Gateway } from '../gateway';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import { Socket } from 'socket.io';
import { Member } from '../../../shared/interfaces/member.interface';
import {
  CbFetchCurrentPlayingPayload,
  FetchCurrentPlayingPayload,
  StreamPlayPayload,
} from '../payloads/fetchCurrentPlaying.payload';
import { PlayerPayload } from '../payloads/player.payload';

@AsyncApiService()
export class StreamEmit {
  constructor(
    @Inject(forwardRef(() => Gateway)) private chatGateway: Gateway,
  ) {}

  @AsyncApiSub({
    channel: SocketKeys.STREAM_FETCH_CURRENT_PLAYING,
    tags: [{ name: 'stream' }],
    description:
      'Subscribe to Fetching current playing movie information from the room manager (owner)',
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
      'Subscribe to Callback function for fetching current playing movie information',
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
    description: 'Subscribe to Toggling play/pause state for media playback',
    message: {
      name: SocketKeys.STREAM_TOGGLE_PLAY,
      payload: { type: PlayerPayload },
    },
  })
  togglePlay(socket: Socket, roomId: string, data: PlayerPayload) {
    socket.to(roomId).emit(SocketKeys.STREAM_TOGGLE_PLAY, data);
  }

  @AsyncApiSub({
    channel: SocketKeys.STREAM_PLAY,
    tags: [{ name: 'stream' }],
    description: 'Subscribe to receive movie stream playback events',
    message: {
      name: SocketKeys.STREAM_PLAY,
      payload: { type: StreamPlayPayload },
    },
  })
  play(socket: Socket, roomId: string, movie: any) {
    socket.to(roomId).emit(SocketKeys.STREAM_PLAY, movie);
  }

  @AsyncApiSub({
    channel: SocketKeys.STREAM_SEEK,
    tags: [{ name: 'stream' }],
    description:
      'Send a seek event to synchronize playback time across all users in a chat or streaming system',
    message: {
      name: SocketKeys.STREAM_SEEK,
      payload: { type: PlayerPayload },
    },
  })
  seek(socket: Socket, roomId: string, data: PlayerPayload) {
    socket.to(roomId).emit(SocketKeys.STREAM_SEEK, data);
  }
}
