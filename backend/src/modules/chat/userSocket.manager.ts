import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class UserSocketManager {
  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async findSocketByUserId(userId: number) {
    const sockets = await this.chatGateway.server.sockets.fetchSockets();
    return sockets.find((so) => so.data.userId === userId);
  }
}
