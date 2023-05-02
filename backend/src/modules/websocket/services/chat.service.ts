import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Gateway } from '../gateway';
import { MessageCreateDto } from '../../http/messages/dtos/creates.dto';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { RemoteSocket, Socket } from 'socket.io';
import { MessagesService } from '../../http/messages/messages.service';
import { ChatEmit } from '../emits/chat.emit';
import {
  Message,
  MessageUpdateResult,
} from '../../../shared/interfaces/message.interface';
import { MessageUpdateDto } from '../../http/messages/dtos/update.dto';
import { UserSocketManager } from '../userSocket.manager';

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => Gateway))
    private gateway: Gateway,
    private messageService: MessagesService,
    private chatEmits: ChatEmit,
    private userSocketManager: UserSocketManager,
  ) {}

  async findSocketByUserIdAndJoinToRoom(
    userId: number,
    roomId: number,
  ): Promise<void> {
    try {
      const userSocket = await this.userSocketManager.findOneSocketByUserId(
        userId,
      );
      if (userSocket) userSocket.join(roomId.toString());
    } catch (e) {
      /// log
    }
  }

  async findSocketByUserIdAndLaveFromRoom(
    userId: number,
    roomId: number,
  ): Promise<void> {
    try {
      const userSocket = await this.userSocketManager.findOneSocketByUserId(
        userId,
      );
      if (userSocket) userSocket.leave(roomId.toString());
    } catch (e) {
      //error
    }
  }

  async sendMessageRoom(data: MessageCreateDto, socket: Socket) {
    try {
      const roomId: number = data.roomId;
      if (!socket.rooms.has(roomId.toString()))
        throw new NotFoundException(ResponseMessages.ROOM_NOT_FOUND);
      const memberId: number =
        await this.userSocketManager.findOneUserIdBySocketId(socket.id);
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

  async fetchOnlineMembers(roomId: string, socket: Socket) {
    const sockets: RemoteSocket<any, any>[] =
      await this.userSocketManager.getRoomSockets(roomId);

    if (!socket.rooms.has(roomId))
      throw new ForbiddenException(ResponseMessages.PERMISSION_DENIED);

    const membersId: Array<number> = [];

    for (const socketMember of sockets) {
      membersId.push(socketMember.data.userId);
    }

    this.chatEmits.callbackFetchOnlineMembers(socket, membersId);
  }
}
