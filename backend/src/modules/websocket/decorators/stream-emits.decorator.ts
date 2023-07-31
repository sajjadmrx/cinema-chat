import { applyDecorators } from '@nestjs/common';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import {
  CbFetchCurrentPlayingPayload,
  FetchCurrentPlayingPayload,
  StreamPlayPayload,
} from '../payloads/fetchCurrentPlaying.payload';
import { PlayerPayload } from '../payloads/player.payload';

export function WsEmitFetchCurrentPlaying() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.STREAM_FETCH_CURRENT_PLAYING,
      tags: [{ name: 'stream' }],
      description:
        'Subscribe to Fetching current playing movie information from the room manager (owner)',
      message: {
        name: SocketKeys.STREAM_FETCH_CURRENT_PLAYING,
        payload: { type: FetchCurrentPlayingPayload },
      },
    }),
  );
}

export function WsEmitCallbackCurrentPlaying() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.STREAM_CB_CURRENT_PLAYING,
      tags: [{ name: 'stream' }],
      description:
        'Subscribe to Callback function for fetching current playing movie information',
      message: {
        name: SocketKeys.STREAM_CB_CURRENT_PLAYING,
        payload: { type: CbFetchCurrentPlayingPayload },
      },
    }),
  );
}

export function WsEmitToggleStream() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.STREAM_TOGGLE_PLAY,
      tags: [{ name: 'stream' }],
      description: 'Subscribe to Toggling play/pause state for media playback',
      message: {
        name: SocketKeys.STREAM_TOGGLE_PLAY,
        payload: { type: PlayerPayload },
      },
    }),
  );
}

export function WsEmitStreamPlay() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.STREAM_PLAY,
      tags: [{ name: 'stream' }],
      description: 'Subscribe to receive movie stream playback events',
      message: {
        name: SocketKeys.STREAM_PLAY,
        payload: { type: StreamPlayPayload },
      },
    }),
  );
}

export function WsEmitStreamSeek() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.STREAM_SEEK,
      tags: [{ name: 'stream' }],
      description:
        'Send a seek event to synchronize playback time across all users in a chat or streaming system',
      message: {
        name: SocketKeys.STREAM_SEEK,
        payload: { type: PlayerPayload },
      },
    }),
  );
}
