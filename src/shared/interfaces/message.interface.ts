import { Message as _Message, Prisma } from "@prisma/client";

export interface Message extends _Message {
}

export interface MessageCreateInput extends Prisma.MessageCreateInput {
  roomId: number;
  authorId: number;
}

export interface MessageUpdateInput extends MessageCreateInput {
}