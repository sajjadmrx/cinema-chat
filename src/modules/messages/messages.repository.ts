import { PrismaService } from "../prisma/prisma.service";
import { Message, MessageCreateInput, MessageUpdateInput } from "../../shared/interfaces/message.interface";
import { getRandomNumber } from "../../shared/utils/uuid.util";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MessagesRepository {
  constructor(private db: PrismaService) {
  }

  create(input: Omit<MessageCreateInput, "messageId">): Promise<Message> {
    return this.db.message.create({
      data: {
        roomId: input.roomId,
        messageId: getRandomNumber(11),
        authorId: input.authorId,
        content: input.content,
        replyId: input.replyId
      }
    });
  }

  getById(messageId: number): Promise<Message | null> {
    return this.db.message.findUnique({ where: { messageId } });
  }


  update(messageId: number, data: MessageUpdateInput): Promise<Message> {
    return this.db.message
      .update({
        where: { messageId },
        data: data
      });
  }

  findByRoomId(roomId: number, page: number, limit: number): Promise<Message[]> {
    return this.db.message.findMany({
      where: {
        roomId
      },
      take: limit,
      skip: (page - 1) * limit
    });
  }
}