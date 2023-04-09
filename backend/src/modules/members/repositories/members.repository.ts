import { MembersDbRepository } from './members-db.repository';
import { MembersCacheRepository } from './members-cache.repository';
import {
  Member,
  MemberCreateInput,
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
    const member = await this.membersDbRepo.create(input);
    await this.membersCacheRepo.addMember(member.roomId, member);
    return member;
  }

  async find(roomId: number, page: number, limit: number): Promise<Member[]> {
    return this.membersDbRepo.find(roomId, page, limit);
  }

  async getByRoomIdAndUserId(
    roomId: number,
    userId: number,
  ): Promise<MemberWithRoom | null> {
    const memberCache = await this.membersCacheRepo.getMember(roomId, userId);
    if (memberCache) return memberCache;
    return this.membersDbRepo.getByRoomIdAndUserId(roomId, userId);
  }
}
