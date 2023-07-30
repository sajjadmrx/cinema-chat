import { SocketKeys } from '../../../shared/constants/socket.keys';
import { ApiProperty } from '@nestjs/swagger';

export class FetchCurrentPlayingPayload {
  @ApiProperty({ default: 925674628193, description: 'user target' })
  cbTarget: number;
  @ApiProperty({ default: 26297437 })
  roomId: number;
  @ApiProperty({ default: SocketKeys.STREAM_CB_CURRENT_PLAYING })
  cbEvent: SocketKeys = SocketKeys.STREAM_CB_CURRENT_PLAYING;
}

export class CbFetchCurrentPlayingPayload {
  @ApiProperty({ default: 26297437 })
  roomId: number;

  @ApiProperty({ default: 20.1 })
  currentTime: number;

  @ApiProperty({ default: false })
  paused: boolean;

  // @ApiProperty({
  //   examples: [
  //     {
  //       id: '64306416450ba41ad521ae2c',
  //       movieId: 617141,
  //       mediaSrc: 'uploads\\movies\\1680892890569-127671098-spaider.mp4',
  //       hlsSrc: 'hls/spaider',
  //       hlsPlaylistPath: 'hls\\spaider\\spaider_480_hls.m3u8',
  //       description: 'spaider',
  //       createdAt: '2023-04-07T18:42:30.894Z',
  //       updatedAt: '2023-04-07T18:42:30.894Z',
  //     },
  //     null,
  //   ],
  // })
  // movie: Movie | null;
}

export class StreamPlayPayload {
  // @ApiProperty({
  //   examples: [
  //     {
  //       id: '64306416450ba41ad521ae2c',
  //       movieId: 617141,
  //       mediaSrc: 'uploads\\movies\\1680892890569-127671098-spaider.mp4',
  //       hlsSrc: 'hls/spaider',
  //       hlsPlaylistPath: 'hls\\spaider\\spaider_480_hls.m3u8',
  //       description: 'spaider',
  //       createdAt: '2023-04-07T18:42:30.894Z',
  //       updatedAt: '2023-04-07T18:42:30.894Z',
  //     },
  //     null,
  //   ],
  // })
  // movie: Movie;

  @ApiProperty({ default: 26297437 })
  roomId: number;
}
