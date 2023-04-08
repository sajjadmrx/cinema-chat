import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MovieCreateDto {
  @ApiProperty({
    description: "path of movie",
    example: "/media/movie.mp4"
  })
  @IsString()
  @IsNotEmpty()
  mediaSrc: string;

  @ApiProperty({
    description: "path of movie hls folder",
    example: "/hls/xx"
  })
  @IsString()
  @IsNotEmpty()
  hlsSrc: string;

  @ApiProperty({
    description: "path of movie hls playlist",
    example: "/hls/xx/xx.m3u8"
  })
  @IsString()
  @IsNotEmpty()
  hlsPlaylistPath: string;

  @ApiProperty({
    example: "best movie"
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
