import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(private chatGateway: ChatGateway) {}

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
}
