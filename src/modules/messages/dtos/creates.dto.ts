import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class MessageCreateDto {
  @ApiProperty({ required: true })
  @IsString()
  content: string;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  replyId: number | null;

  @ApiProperty({ required: true })
  @IsNumber()
  roomId: number;
  //TODO add: attachments;

}