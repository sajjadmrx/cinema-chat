import { ApiProperty } from '@nestjs/swagger';

export class MessagePayload {
  @ApiProperty({ default: '64341e9c50570b71e2f57df7' })
  id: string;
  @ApiProperty({ default: 56964989175 })
  messageId: number;

  @ApiProperty({ default: 692869485481 })
  authorId: number;

  @ApiProperty({ default: 26297437 })
  roomId: number;

  @ApiProperty({ default: 'hello' })
  content: string;

  @ApiProperty({ examples: [56964989181, null] })
  replyId: number | null;

  @ApiProperty({ default: 'TEXT' })
  type: string;

  @ApiProperty({ default: '2023-04-10T14:35:08.565Z' })
  createdAt: Date;

  @ApiProperty({ default: '2023-04-10T14:35:08.565Z' })
  updatedAt: Date;
}
export class MessageUpdatePayload {
  @ApiProperty({})
  readonly roomId: number;

  @ApiProperty()
  readonly oldMessage: MessagePayload;

  @ApiProperty()
  readonly newMessage: MessagePayload;
}

export class MessageDeletePayload {
  @ApiProperty({
    example: 123456789,
    description: 'room id',
  })
  readonly roomId: number;

  @ApiProperty({
    example: 123456,
    description: 'message id',
  })
  readonly messageId: number;

  @ApiProperty({ example: 12345678, description: 'member id' })
  readonly byId: number;
}
