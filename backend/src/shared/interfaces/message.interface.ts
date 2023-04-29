import { Message as _Message, Prisma } from '@prisma/client';

export interface Message extends _Message {}

export interface MessageCreateInput
  extends Omit<Prisma.MessageCreateInput, 'author'> {
  roomId: number;
  authorId: number;
}

export interface MessageUpdateInput extends Partial<MessageCreateInput> {}

export interface MessageUpdateResult {
  oldMessage: Message;
  newMessage: Message;
}
