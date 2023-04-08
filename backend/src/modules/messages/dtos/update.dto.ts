import { MessageCreateDto } from "./creates.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class MessageUpdateDto extends MessageCreateDto {
  @ApiProperty({ required: true })
  @IsNumber({ allowNaN: false })
  messageId: number;
}