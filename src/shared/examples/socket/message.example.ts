import { Message } from "../../interfaces/message.interface";
import { ApiProperty } from "@nestjs/swagger";

export class MessageUpdateExa {
  @ApiProperty()
  roomId: number;

  @ApiProperty()
  oldMessage: Message;

  @ApiProperty()
  newMessage: Message;
}