import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';
import { SocketKeys } from '../../../shared/constants/socket.keys';

export class GetCurrentPlayingDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false })
  roomId: number;
}
export class StreamNowPlayingDto extends GetCurrentPlayingDto {
  @IsNumber({ allowNaN: true })
  @ApiProperty()
  currentTime: number | null;

  @IsBoolean()
  @ApiProperty()
  paused: boolean;

  @IsNumber()
  @ApiProperty({
    description: `The user ID of the target for the callback. This value is provided in the [${SocketKeys.STREAM_FETCH_CURRENT_PLAYING}] event.`,
  })
  cbTarget: number;
}

export class StreamTogglePlay extends GetCurrentPlayingDto {
  @ApiProperty({ default: 26297437 })
  roomId: number;

  @IsNumber({ allowNaN: true })
  @ApiProperty()
  currentTime: number | null;

  @IsBoolean()
  @ApiProperty()
  paused: boolean;
}
export class StreamPlayDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false })
  roomId: number;

  @ApiProperty()
  @IsString()
  src: string;
}
