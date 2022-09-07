import { ApiProperty } from "@nestjs/swagger";

export class MovieCreateDto {
  @ApiProperty()
  src: string

  @ApiProperty()
  description: string
}