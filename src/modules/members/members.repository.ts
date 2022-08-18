import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberCreateInput,
  MemberUpdateInput,
  MemberWithRoom,
} from 'src/shared/interfaces/member.interface';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../shared/interfaces/user.interface';

@Injectable()
export class MembersRepository {
  constructor(private db: PrismaService) {}

  async create(input: MemberCreateInput): Promise<Member> {
    return this.db.member.create({ data: input });
  }

  async find(roomId: number, page: number, limit: number): Promise<Member[]> {
    return this.db.member.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        roomId,
      },
    });
  }

  async getByRoomIdAndUserId(
    roomId: number,
    userId: number,
  ): Promise<MemberWithRoom | null> {
    return this.db.member.findFirst({
      where: { roomId, userId },
      include: { room: true },
    });
  }

  async deleteByRoomIdAndUserId(
    roomId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const result = await this.db.member.deleteMany({
        where: { roomId, userId },
      });
      return result.count > 0;
    } catch (e) {
      throw e;
    }
  }

  async updateOne(
    roomId: number,
    userId: number,
    input: MemberUpdateInput,
  ): Promise<boolean> {
    try {
      const result = await this.db.member.updateMany({
        where: {
          userId,
          roomId,
        },
        data: {
          nickname: input.nickname,
          permissions: input.permissions,
        },
      });
      return result.count > 0;
    } catch (e) {
      throw e;
    }
  }
}
