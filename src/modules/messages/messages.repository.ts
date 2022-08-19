import { PrismaService } from "../prisma/prisma.service";
import { Message, MessageCreateInput } from "../../shared/interfaces/message.interface";
import { getRandomNumber } from "../../shared/utils/uuid.util";

export class MessagesRepository {
  constructor(private db: PrismaService) {
  }

  create(input: Omit<MessageCreateInput, "messageId">): Promise<Message> {
    return this.db.message.create({
      data: {
        roomId: input.roomId,
        messageId: getRandomNumber(11),
        authorId: input.roomId,
        content: input.content,
        replyId: input.replyId
      }
    });
  }
}