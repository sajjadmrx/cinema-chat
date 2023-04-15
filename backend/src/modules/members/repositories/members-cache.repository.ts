import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberWithRoom,
} from '../../../shared/interfaces/member.interface';
import { InjectRedis, RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class MembersCacheRepository {
  private readonly cachePrefix = 'members:';
  constructor(@InjectRedis() private readonly cacheService: Redis) {}

  async getMembers(roomId: number): Promise<MemberWithRoom[]> {
    const cacheKey = this.cachePrefix + roomId;
    const cachedData = await this.cacheService.get(cacheKey);
    return cachedData ? JSON.parse(cachedData) : [];
  }

  async updateMembers(roomId: number, members: Member[]): Promise<void> {
    const cacheKey = this.cachePrefix + roomId;
    await this.cacheService.set(cacheKey, JSON.stringify(members));
  }

  async deleteMembers(roomId: number): Promise<void> {
    const cacheKey = this.cachePrefix + roomId;
    await this.cacheService.del(cacheKey);
  }

  async deleteMember(roomId: number, userId: number): Promise<void> {
    const currentMembers = await this.getMembers(roomId);
    const newMembers = currentMembers.filter(
      (member) => member.userId !== userId,
    );
    await this.updateMembers(roomId, newMembers);
  }
  async addMember(roomId: number, member: Member): Promise<void> {
    const cacheKey = this.cachePrefix + roomId;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      const cachedDataObj = JSON.parse(cachedData);
      cachedDataObj.push(member);
      await this.cacheService.set(cacheKey, JSON.stringify(cachedDataObj));
    }
  }

  async getMember(
    roomId: number,
    userId: number,
  ): Promise<MemberWithRoom | null> {
    const members = await this.getMembers(roomId);
    return members.find((member: Member) => member.userId === userId) || null;
  }

  async updateMember(
    roomId: number,
    userId: number,
    updatedMember: MemberWithRoom,
  ): Promise<void> {
    const cachedData = await this.getMembers(roomId);
    if (cachedData) {
      const memberIndex = cachedData.findIndex(
        (member) => member.userId === userId,
      );
      if (memberIndex !== -1) {
        cachedData[memberIndex] = updatedMember;
        await this.updateMembers(roomId, cachedData);
      }
    }
  }
}
