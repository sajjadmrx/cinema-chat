import { MessagesRepository } from './messages.repository';
import {
  Message,
  MessageUpdateResult,
} from '../../../shared/interfaces/message.interface';
import { MessageCreateDto } from './dtos/creates.dto';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { MessageUpdateDto } from './dtos/update.dto';
import { Room } from '../../../shared/interfaces/room.interface';
import { RoomsRepository } from '../rooms/rooms.repository';
import { ChatEmit } from '../../websocket/emits/chat.emit';
import { MembersRepository } from '../members/repositories/members.repository';
import { ResponseFormat } from '../../../shared/interfaces/response.interface';

@Injectable()
export class MessagesService {
  constructor(
    private messagesRepository: MessagesRepository,
    private roomsRepository: RoomsRepository,
    private membersRepository: MembersRepository,
    private chatEmits: ChatEmit,
  ) {}

  async getRoomMessages(
    roomId: number,
    page: number,
    limit: number,
  ): Promise<ResponseFormat<Message[]>> {
    try {
      if (!Number(roomId)) throw new BadRequestException();

      const maxLimit = 10;
      if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
        page = 1;
        limit = maxLimit;
      }
      if (limit > maxLimit) limit = maxLimit;

      const messages: Message[] = await this.messagesRepository.findByRoomId(
        roomId,
        page,
        limit,
      );
      return {
        statusCode: HttpStatus.OK,
        data: messages,
      };
    } catch (e) {
      throw e;
    }
  }

  async getByMessageId(messageId: number): Promise<ResponseFormat<Message>> {
    if (!Number(messageId)) throw new BadRequestException();

    const message = await this.messagesRepository.getById(messageId);
    return {
      statusCode: HttpStatus.OK,
      data: message,
    };
  }

  async create(
    roomId: number,
    memberId: number,
    input: MessageCreateDto,
  ): Promise<Message> {
    try {
      if (Number(input.replyId)) {
        const hasReplyMessage = await this.messagesRepository.getById(
          input.replyId,
        );
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
        type: 'TEXT',
      });
      return message;
    } catch (e) {
      throw e;
    }
  }

  async update(
    roomId: number,
    memberId: number,
    messageId: number,
    input: MessageUpdateDto,
  ): Promise<MessageUpdateResult> {
    try {
      const oldMessage: Message | null = await this.messagesRepository.getById(
        messageId,
      );

      if (!oldMessage)
        throw new NotFoundException(ResponseMessages.MESSAGE_NOT_FOUND);
      if (memberId != oldMessage.authorId) throw new BadRequestException(); //TODO Better Message;

      const room: Room | null = await this.roomsRepository.getById(roomId);
      if (!room) throw new BadRequestException(ResponseMessages.ROOM_NOT_FOUND);

      const newMessage: Message = await this.messagesRepository.update(
        messageId,
        {
          roomId: room.roomId,
          content: input.content,
        },
      );

      return { oldMessage, newMessage };
    } catch (e) {
      throw e;
    }
  }

  async deleteRoomMessage(
    roomId: number,
    memberId: number,
    messageId: number,
  ): Promise<ResponseFormat<any>> {
    try {
      if (!Number(roomId) || !Number(messageId))
        throw new BadRequestException();

      const message: Message | null = await this.messagesRepository.getById(
        messageId,
      );
      if (!message)
        throw new NotFoundException(ResponseMessages.MESSAGE_NOT_FOUND);
      if (message.roomId != roomId)
        throw new BadRequestException(ResponseMessages.INVALID_ROOM);

      if (message.authorId != memberId) {
        const member = await this.membersRepository.getByRoomIdAndUserId(
          roomId,
          memberId,
        );
        const hasPerm: boolean = member.permissions.includes('ADMINISTRATOR'); //TODO Add MANAGE_MESSAGES Permission
        if (!hasPerm)
          throw new ForbiddenException(ResponseMessages.INVALID_PERMISSION);
      }

      const deletedMessage: Message = await this.messagesRepository.deleteById(
        messageId,
      );
      this.chatEmits.deleteMessage(roomId, memberId, messageId);
      return {
        statusCode: HttpStatus.OK,
        data: {
          messageId: deletedMessage.messageId,
        },
      };
    } catch (e) {
      throw e;
    }
  }
}
