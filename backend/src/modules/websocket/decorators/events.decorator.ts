import { applyDecorators } from '@nestjs/common';
import { AsyncApiPub } from 'nestjs-asyncapi';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import { MessageCreateDto } from '../../http/messages/dtos/creates.dto';
import { MessageUpdateDto } from '../../http/messages/dtos/update.dto';
import {
  GetCurrentPlayingDto,
  StreamNowPlayingDto,
  StreamPlayDto,
  StreamTogglePlay,
} from '../dtos/stream.dto';
import { PickType } from '@nestjs/swagger';
import {
  FetchOnlineMembersPayload,
  UpdateMemberStatusPayload,
} from '../payloads/member.payload';
import { SubscribeMessage } from '@nestjs/websockets';

export function WsEventCreateMessage() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.CREATE_MESSAGE,
      message: { name: 'test', payload: { type: MessageCreateDto } },
      tags: [{ name: 'message', description: 'Messages on room' }],
      description: 'call event create Message',
    }),
    SubscribeMessage(SocketKeys.CREATE_MESSAGE),
  );
}

export function WsEventUpdateMessage() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.UPDATE_MESSAGE,
      message: { name: 'UPDATE_MESSAGE', payload: { type: MessageUpdateDto } },
      tags: [{ name: 'message' }],
    }),
    SubscribeMessage(SocketKeys.UPDATE_MESSAGE),
  );
}

export function WsEventGetCurrentPlaying() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.STREAM_GET_CURRENT_PLAYING,
      message: {
        name: SocketKeys.STREAM_GET_CURRENT_PLAYING,
        payload: { type: GetCurrentPlayingDto },
      },
      tags: [{ name: 'stream' }],
      summary: `Get the current stream with response in the event: ${SocketKeys.STREAM_CB_CURRENT_PLAYING}`,
    }),
    SubscribeMessage(SocketKeys.STREAM_GET_CURRENT_PLAYING),
  );
}

export function WsEventCallbackCurrentPlaying() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.STREAM_CB_CURRENT_PLAYING,
      message: {
        name: SocketKeys.STREAM_CB_CURRENT_PLAYING,
        payload: { type: StreamNowPlayingDto },
      },
      summary: `Send the current playing stream to the specified target`,
    }),
    SubscribeMessage(SocketKeys.STREAM_CB_CURRENT_PLAYING),
  );
}

export function WsEventStreamPlay() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.STREAM_PLAY,
      message: {
        name: SocketKeys.STREAM_PLAY,
        payload: { type: StreamPlayDto },
      },
      tags: [{ name: 'stream' }],
    }),
    SubscribeMessage(SocketKeys.STREAM_PLAY),
  );
}

export function WsEventStreamTogglePlay() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.STREAM_TOGGLE_PLAY,
      message: {
        name: SocketKeys.STREAM_TOGGLE_PLAY,
        payload: { type: StreamTogglePlay },
      },
      tags: [{ name: 'stream' }],
    }),
    SubscribeMessage(SocketKeys.STREAM_TOGGLE_PLAY),
  );
}

export function WsEventStreamSeek() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.STREAM_SEEK,
      message: {
        name: SocketKeys.STREAM_SEEK,
        payload: { type: StreamTogglePlay },
      },
      tags: [{ name: 'stream' }],
    }),
    SubscribeMessage(SocketKeys.STREAM_SEEK),
  );
}

export function WsEventFetchOnlineMembers() {
  return applyDecorators(
    AsyncApiPub({
      channel: SocketKeys.FETCH_ONLINE_MEMBERS,
      message: {
        name: SocketKeys.FETCH_ONLINE_MEMBERS,
        payload: { type: FetchOnlineMembersPayload },
      },
      summary: 'fetch online members',
      tags: [{ name: 'Member' }],
    }),
    SubscribeMessage(SocketKeys.FETCH_ONLINE_MEMBERS),
  );
}
