import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberCreateInput,
  MemberWithRoom,
} from 'src/shared/interfaces/member.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersRepository {
  constructor(private db: PrismaService) {}

  async create(input: MemberCreateInput): Promise<Member> {
    return this.db.member.create({ data: input });
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
}
