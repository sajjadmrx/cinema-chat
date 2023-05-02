import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Gateway } from './gateway';
import { RedisService } from '../redis/redis.service';
import { Socket } from 'socket.io';

@Injectable()
export class UserSocketManager {
  constructor(
    @Inject(forwardRef(() => Gateway))
    private gateway: Gateway,
    private redisService: RedisService,
  ) {}

  async findOneSocketByUserId(userId: number) {
    const sockets = await this.gateway.server.sockets.fetchSockets();
    return sockets.find((so) => so.data.userId === userId);
  }

  async findOneUserIdBySocketId(socketId: string): Promise<number | null> {
    const userId: string | null = await this.redisService.get(
      `ws:client:${socketId}`,
    );
    // if (socket) return socket.data.userId;
    return Number(userId) || null;
  }

  async saveUserIdBySocketId(socketId: string, userId: number) {
    await this.redisService.set(`ws:client:${socketId}`, userId);
  }

  async removeUserId(socketId: string) {
    await this.redisService.del(`ws:client:${socketId}`);
  }
}
