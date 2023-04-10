import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Gateway } from './gateway';

@Injectable()
export class UserSocketManager {
  constructor(
    @Inject(forwardRef(() => Gateway))
    private gateway: Gateway,
  ) {}

  async findOneSocketByUserId(userId: number) {
    const sockets = await this.gateway.server.sockets.fetchSockets();
    return sockets.find((so) => so.data.userId === userId);
  }
}
