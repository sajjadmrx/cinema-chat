import { MembersDbRepository } from './members-db.repository';
import { MembersCacheRepository } from './members-cache.repository';
import {
  Member,
  MemberCreateInput,
  MemberUpdateInput,
  MemberWithRoom,
} from '../../../shared/interfaces/member.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MembersRepository {
  constructor(
    private membersDbRepo: MembersDbRepository,
    private membersCacheRepo: MembersCacheRepository,
  ) {}

  async create(input: MemberCreateInput): Promise<Member> {
    try {
      const member = await this.membersDbRepo.create(input);
      await this.membersCacheRepo.addMember(member.roomId, member);
      return member;
    } catch (e) {
      throw e;
    }
  }

  async find(roomId: number, page: number, limit: number): Promise<Member[]> {
    return this.membersDbRepo.find(roomId, page, limit);
  }

  async membersCount(roomId: number): Promise<number> {
    return this.membersDbRepo.membersCount(roomId);
  }

  async getByRoomIdAndUserId(
    roomId: number,
    userId: number,
  ): Promise<MemberWithRoom | null> {
    try {
      const memberCache = await this.membersCacheRepo.getMember(roomId, userId);
      if (memberCache) return memberCache;
      const memberDB = await this.membersDbRepo.getByRoomIdAndUserId(
        roomId,
        userId,
      );
      await this.membersCacheRepo.addMember(roomId, memberDB);
      return memberDB;
    } catch (e) {
      throw e;
    }
  }
  findByUserId(userId: number): Promise<MemberWithRoom[]> {
    return this.membersDbRepo.findByUserId(userId);
  }
  async updateOne(
    roomId: number,
    userId: number,
    input: MemberUpdateInput,
  ): Promise<boolean> {
    try {
      const result = await this.membersDbRepo.updateOne(roomId, userId, input);
      if (result) {
        const member = await this.membersDbRepo.getByRoomIdAndUserId(
          roomId,
          userId,
        );
        await this.membersCacheRepo.updateMember(roomId, userId, member);
      }
      return result;
    } catch (e) {
      throw e;
    }
  }

  async deleteByRoomIdAndUserId(
    roomId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const result = await this.membersDbRepo.deleteByRoomIdAndUserId(
        roomId,
        userId,
      );
      if (result) await this.membersCacheRepo.deleteMember(roomId, userId);

      return result;
    } catch (e) {
      throw e;
    }
  }
}
