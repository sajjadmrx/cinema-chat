import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MovieCreateDto {
  @ApiProperty({
    description: "path of movie",
    example: "/media/movie.mp4"
  })
  @IsString()
  @IsNotEmpty()
  src: string;

  @ApiProperty({
    example: "best movie"
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}