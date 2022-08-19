import { MessagesRepository } from "./messages.repository";
import { Message, MessageCreateInput } from "../../shared/interfaces/message.interface";
import { MessageCreateDto } from "./dtos/creates.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";

@Injectable()
export class MessagesService {
  constructor(private messagesRepository: MessagesRepository) {
  }


  async create(roomId: number, memberId: number, input: MessageCreateDto): Promise<Message> {

    try {
      if (Number(input.replyId)) {
        const hasReplyMessage = await this.messagesRepository.getById(input.replyId);
        if (!hasReplyMessage)
          throw new NotFoundException(ResponseMessages.REPLY_NOT_FOUND);
      } else {
        input.replyId = null;
      }

      const message = await this.messagesRepository.create({
        roomId,
        authorId: memberId,
        replyId: input.replyId,
        content: input.content,
        type: "TEXT"
      });
      return message;

    } catch (e) {
      throw e;
    }
  }
}