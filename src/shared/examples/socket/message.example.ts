import { Message } from "../../interfaces/message.interface";
import { ApiProperty } from "@nestjs/swagger";

export class MessageUpdateExa {
  @ApiProperty({})
  readonly roomId: number;

  @ApiProperty()
  readonly oldMessage: Message;

  @ApiProperty()
  readonly newMessage: Message;
}

export class MessageDeleteExa {
  @ApiProperty({
    example: 123456789,
    description: "room id"
  })
  readonly roomId: number;

  @ApiProperty({
    example: 123456,
    description: "message id"
  })
  readonly messageId: number;

  @ApiProperty({ example: 12345678, description: "member id" })
  readonly byId: number;
}