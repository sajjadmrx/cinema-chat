import { PrismaService } from '../../prisma/prisma.service';
import {
  Message,
  MessageCreateInput,
  MessageUpdateInput,
} from '../../../shared/interfaces/message.interface';
import { getRandomNumber } from '../../../shared/utils/uuid.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesRepository {
  private readonly defaultInclude = {
    author: {
      select: {
        nickname: true,
        user: {
          select: {
            username: true,
            userId: true,
          },
        },
      },
    },
  };
  constructor(private db: PrismaService) {}

  create(input: Omit<MessageCreateInput, 'messageId'>): Promise<Message> {
    return this.db.message.create({
      data: {
        author: {
          connect: {
            roomId_userId: {
              userId: input.authorId,
              roomId: input.roomId,
            },
          },
        },
        messageId: getRandomNumber(11),
        content: input.content,
        replyId: input.replyId,
      },
      include: this.defaultInclude,
    });
  }

  getById(messageId: number): Promise<Message | null> {
    return this.db.message.findUnique({ where: { messageId } });
  }

  update(messageId: number, data: MessageUpdateInput): Promise<Message> {
    return this.db.message.update({
      where: { messageId },
      data: data,
    });
  }

  findByRoomId(
    roomId: number,
    page: number,
    limit: number,
  ): Promise<Message[]> {
    return this.db.message.findMany({
      where: {
        roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
      include: this.defaultInclude,
    });
  }

  deleteById(messageId: number): Promise<Message> {
    return this.db.message.delete({ where: { messageId } });
  }
}
