import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatGateway } from '../chat.gateway';
import { MessageCreateDto } from '../../messages/dtos/creates.dto';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { Socket } from 'socket.io';
import { MessagesService } from '../../messages/messages.service';
import { ChatEmits } from '../chat.emits';
import {
  Message,
  MessageUpdateResult,
} from '../../../shared/interfaces/message.interface';
import { MessageUpdateDto } from '../../messages/dtos/update.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private messageService: MessagesService,
    private chatEmits: ChatEmits,
  ) {}

  async findSocketByUserIdAndJoinToRoom(
    userId: number,
    roomId: number,
  ): Promise<void> {
    try {
      const sockets = await this.chatGateway.server.sockets.fetchSockets();
      const userSockets = sockets.filter((so) => so.data.userId == userId);
      if (userSockets.length)
        userSockets.map((socket) => socket.join(roomId.toString()));
    } catch (e) {
      /// log
    }
  }

  async findSocketByUserIdAndLaveFromRoom(
    userId: number,
    roomId: number,
  ): Promise<void> {
    try {
      const socketsOnRoom =
        await this.chatGateway.server.sockets.fetchSockets();
      const userSockets = socketsOnRoom.filter((s) => s.data.userId == userId);
      if (userSockets.length)
        userSockets.map((socket) => socket.leave(roomId.toString()));
    } catch (e) {
      //error
    }
  }

  async sendMessageRoom(data: MessageCreateDto, socket: Socket) {
    try {
      const roomId: number = data.roomId;
      if (!socket.rooms.has(roomId.toString()))
        throw new NotFoundException(ResponseMessages.ROOM_NOT_FOUND);
      const memberId: number = socket.data.userId;
      const message: Message = await this.messageService.create(
        roomId,
        memberId,
        data,
      );

      this.chatEmits.createMessage(message);
    } catch (e) {
      throw e;
    }
  }

  async updateMessageRoom(data: MessageUpdateDto, socket: Socket) {
    try {
      const roomId: number = data.roomId;
      if (!socket.rooms.has(roomId.toString()))
        throw new NotFoundException(ResponseMessages.ROOM_NOT_FOUND);
      const memberId: number = socket.data.userId;
      const { oldMessage, newMessage }: MessageUpdateResult =
        await this.messageService.update(
          roomId,
          memberId,
          data.messageId,
          data,
        );
      this.chatEmits.updateMessage(roomId, oldMessage, newMessage);
    } catch (e) {
      throw e;
    }
  }
}
