import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "../../../shared/interfaces/movie.interface";
import { IsBoolean, IsNumber, IsObject } from "class-validator";

export class StreamNowPlayingDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false })
  roomId: number;


  @IsNumber({ allowNaN: false })
  @ApiProperty()
  mediaId: number;


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
  @IsObject()
  video: Movie;

}
