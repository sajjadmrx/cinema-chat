import { ApiProperty } from '@nestjs/swagger';

export class TogglePlayPayload {
  @ApiProperty({ default: 26297437 })
  roomId: number;

  @ApiProperty({ default: 0 })
  currentTime: 0;

  @ApiProperty({ default: true, type: Boolean })
  paused: true;
}
