import { MessagesRepository } from "./messages.repository";
import { Message, MessageCreateInput, MessageUpdateResult } from "../../shared/interfaces/message.interface";
import { MessageCreateDto } from "./dtos/creates.dto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";
import { MessageUpdateDto } from "./dtos/update.dto";
import { Room } from "../../shared/interfaces/room.interface";
import { RoomsRepository } from "../rooms/rooms.repository";

@Injectable()
export class MessagesService {
  constructor(private messagesRepository: MessagesRepository, private roomsRepository: RoomsRepository) {
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

  async update(roomId: number, memberId: number, messageId: number, input: MessageUpdateDto): Promise<MessageUpdateResult> {
    try {
      const oldMessage: Message | null = await this.messagesRepository.getById(messageId);

      if (!oldMessage)
        throw new NotFoundException(ResponseMessages.MESSAGE_NOT_FOUND);
      if (memberId != oldMessage.authorId)
        throw new BadRequestException();//TODO Better Message;

      const room: Room | null = await this.roomsRepository.getById(roomId);
      if (!room)
        throw new BadRequestException(ResponseMessages.ROOM_NOT_FOUND);

      const newMessage: Message = await this.messagesRepository.update(messageId, {
        roomId: room.roomId,
        content: input.content
      });

      return { oldMessage, newMessage };
    } catch (e) {
      throw e;
    }
  }
}