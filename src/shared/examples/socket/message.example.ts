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

export class MessageDeleteExa {
  @ApiProperty({
    example: 123456789,
    description: "room id"
  })
  roomId: number;

  @ApiProperty({
    example: 123456,
    description: "message id"
  })
  messageId: number;

  @ApiProperty({ example: 12345678, description: "member id" })
  byId: number;
}