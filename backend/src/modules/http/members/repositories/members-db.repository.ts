import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberCreateInput,
  MemberUpdateInput,
  MemberWithRoom,
} from 'src/shared/interfaces/member.interface';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '../../../../shared/interfaces/user.interface';

@Injectable()
export class MembersDbRepository {
  constructor(private db: PrismaService) {}

  async create(input: MemberCreateInput): Promise<Member> {
    return this.db.member.create({
      data: input,
    });
  }

  async find(roomId: number, page: number, limit: number): Promise<Member[]> {
    return this.db.member.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        roomId,
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
    });
  }

  async membersCount(roomId: number): Promise<number> {
    return this.db.member.count({
      where: {
        roomId,
      },
    });
  }

  async getByRoomIdAndUserId(
    roomId: number,
    userId: number,
  ): Promise<MemberWithRoom | null> {
    return this.db.member.findUnique({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: Number(userId),
        },
      },
      include: {
        room: true,
        user: {
          select: {
            userId: true,
            permissions: true,
            username: true,
          },
        },
      },
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
          AND: {
            userId,
            roomId,
          },
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

  findByUserId(userId: number): Promise<MemberWithRoom[]> {
    return this.db.member.findMany({
      where: {
        userId,
      },
      include: {
        room: true,
        user: {
          select: {
            userId: true,
            permissions: true,
            username: true,
          },
        },
      },
    });
  }
}
